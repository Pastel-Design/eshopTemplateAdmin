<?php

use app\models\DbManager;
use app\router\Router;
use app\config\DbConfig;
use app\models\SignManager;
use app\exceptions\SignException;

mb_internal_encoding("UTF-8");

require("../vendor/autoload.php");
//Funkce pro autoload třídy, php ji používá automaticky díky "zaregistrování" níže

/**
 * @param $class
 */
function autoloadFunction($class)
{
    $classname="../" . preg_replace("/[\\ ]+/", "/", $class) . ".php";
    if (is_readable($classname)) {
        require($classname);
    }
}


//registrace funkce pro její použití jako php autoload funkce
spl_autoload_register("autoloadFunction");
session_start();
//vytvoření instance směrovače a jeho zpracování url a následné vypsání základního pohledu
$router = new Router();
$router->process(array($_SERVER['REQUEST_URI']));
