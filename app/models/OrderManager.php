<?php


namespace app\models;

use app\models\DbManager as DbManager;


/**
 * Manager OrderManager
 *
 * @package app\models
 */
class OrderManager
{

    public function selectShippingVariants()
    {
        return DbManager::requestMultiple("SELECT id,name FROM shipping");
    }

    public function selectPaymentVariants()
    {
        return DbManager::requestMultiple("SELECT id,name FROM payment");
    }
}