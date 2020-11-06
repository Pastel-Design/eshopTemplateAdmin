<?php

namespace app\models;

use app\config\AuthorityConfig;
use app\exceptions\SignException;
use stdClass;

/**
 * Manager SignManager
 *
 * @package app\models
 */
class SignManager
{
    /**
     * Logs an user in
     *
     * @param $login
     * email or username
     * @param $password
     *
     * @return void
     * @throws SignException
     */
    static function SignIn($login, $password)
    {
        (session_status() === 1 ? session_start() : null);
        if (self::userExists($login)) {
            if (self::userActivated($login)) {
                $DBPass = DbManager::requestUnit("SELECT password FROM user WHERE username = ? OR email = ?", [$login, $login]);
                if (password_verify($password, $DBPass)) {
                    $_SESSION["user"] = UserManager::selectUser($login);
                } else {
                    throw new SignException("Wrong password");
                }
            } else {
                throw new SignException("Account not activated");
            }
        } else {
            throw new SignException("Wrong login");
        }
    }

    /**
     * Signs out an user
     *
     * @return void
     */
    static function SignOut(): void
    {
        if (session_status() === 2) {
            unset($_SESSION["user"]);
        }
    }

    /**
     * Verifies if user exists
     *
     * @param $login
     * username or email
     *
     * @return bool
     */
    static function userExists($login)
    {
        return (self::checkUsername($login) || self::checkEmail($login));
    }

    /**
     * Verifies if users account has been activated
     *
     * @param $login
     * username or email
     *
     * @return bool
     */
    static function userActivated($login)
    {
        return (DbManager::requestUnit("SELECT activated FROM user WHERE email = ? OR username = ?", [$login, $login]) === 1);
    }

    /**
     * Check if users username is used
     *
     * @param $username
     *
     * @return bool
     */
    static function checkUsername($username)
    {
        return (DbManager::requestAffect("SELECT username FROM user WHERE username = ?", [$username]) === 1);
    }

    /**
     * Check if users email is used
     *
     * @param $email
     *
     * @return bool
     */
    static function checkEmail($email)
    {
        return (DbManager::requestAffect("SELECT email FROM user WHERE email = ?", [$email]) === 1);
    }

    /**
     * Check if users email is used
     *
     * @return void
     * @throws SignException
     */
    static function checkAdmin()
    {
        if (session_status() != 2) {
            throw (new SignException("Not session"));
        }
        if (!isset($_SESSION["user"])) {
            throw (new SignException("Not set user in session"));
        }
        if (!$_SESSION["user"] instanceof stdClass) {
            throw (new SignException("User not instance of UserObject"));
        }
        $requiredLevel = AuthorityConfig::$allowedLevel;
        if ($_SESSION["user"]->role_level <= !$requiredLevel) {
            throw (new SignException("Inssuficient level"));
        }
    }
}
