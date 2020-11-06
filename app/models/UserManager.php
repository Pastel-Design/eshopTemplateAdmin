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
     * @return void
     */
    public function selectUsers(int $limit, $offset=1){

    }
}