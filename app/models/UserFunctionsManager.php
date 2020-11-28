<?php


namespace app\models;

use DateTime;

/**
 * Manager UserFunctionsManager
 *
 * @package app\models
 */
class UserFunctionsManager
{

    public static function getFormatedDate($date)
    {
        if(strpos($date," ")){
            $date = new DateTime($date);
            $date = $date->format("j.n.o G:i");
        }else{
            $date = new DateTime($date);
            $date = $date->format("j.n.o");
        }
        return $date;
    }
}