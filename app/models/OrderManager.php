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

    public function newOrderNumber()
    {
        return DbManager::requestUnit("SELECT MAX(invoice_number) FROM invoice");
    }

    public function selectEshopInvoiceInfo()
    {
        return DbManager::requestSingle("SELECT * FROM eshop_info");
    }
}