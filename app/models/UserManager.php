<?php


namespace app\models;

use app\classes\AddressClass;
use app\exceptions\UserException;
use app\models\DbManager as DbManager;
use mysql_xdevapi\Exception as Exception;
use stdClass;

/**
 * Manager UserManager
 *
 * @package app\models
 */
class UserManager
{
    /**
     * Selects user from database
     *
     * @param string $login
     * username or email
     *
     * @return object
     */
    public static function selectUser(string $login): object
    {
        return (object)DbManager::requestsingle('
            SELECT user.id, user.email, user.username, CONCAT(user.area_code, user.phone) AS phone, role.name AS role_name, role.level AS role_level, user.first_name, user.last_name 
            FROM user,role 
            WHERE username = ? 
            OR email = ? 
            AND user.role_id = role.id',
            [$login, $login]);
    }

    /**
     * Selects all users from database based on offset and limit
     *
     * @param int $limit
     * @param int $offset
     *
     * @return array
     */
    public function selectUsers(int $limit = 50, $offset = 1)
    {
        $users = DbManager::requestMultiple(' 
        SELECT user.id as "id",email,username,phone,area_code,orders,activated,registered,last_active,first_name,last_name,role.level as "level",role.name as "role_name"
        FROM user JOIN role ON role.id = user.role_id
        ORDER BY user.id
        LIMIT ? OFFSET ?;
        ', [$limit, $offset]);
        $newUsers = array();
        foreach ($users as $user) {
            $invoice = DbManager::requestUnit('SELECT COUNT(id) FROM invoice_address WHERE user_id = ?', [$user["id"]]);
            $shipping = DbManager::requestUnit('SELECT COUNT(id) FROM shipping_address WHERE user_id = ?', [$user["id"]]);
            $user["shipping"]=$shipping;
            $user["invoice"]=$invoice;
            $newUsers[]=$user;
        }
        return $newUsers;
    }

    public function selectUsersEmails()
    {
        return DbManager::requestMultiple('SELECT id, email as name FROM user');
    }
}