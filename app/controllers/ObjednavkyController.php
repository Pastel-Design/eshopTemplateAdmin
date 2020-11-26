<?php

namespace app\controllers;

use app\models\OrderManager;
use app\models\ProductManager;
use app\models\UserManager;

/**
 * Controller ObjednavkyController
 *
 * @package app\controllers
 */
class ObjednavkyController extends Controller
{
    private OrderManager $orderManager;
    private UserManager $userManager;
    private ProductManager $productManager;

    public function __construct()
    {
        parent::__construct();
        $this->orderManager = new OrderManager();
        $this->userManager = new UserManager();
        $this->productManager = new ProductManager();
    }

    /**
     * Sets default homepage
     *
     * @param array      $params
     * @param array|null $gets
     *
     * @return void
     */
    public function process(array $params, array $gets = null)
    {
        if (isset($params[0])) {
            $function = str_replace(" ", "", ucwords(str_replace("-", " ", strtolower($params[0]))));
            array_shift($params);
            if (is_file("../app/views/Objednavky/" . $function . ".latte")) {
                call_user_func(array($this, "render" . $function), $params);
            } else {
                $this->renderSouhrn();
            }
        } else {
            $this->renderSouhrn();
        }
    }

    private function renderSouhrn()
    {
        $this->head['page_title'] = "Objednávky";
        $this->head['page_keywords'] = "";
        $this->head['page_description'] = "";
        $this->setView('default');
    }

    private function renderFaktury($params)
    {
        if (isset($params[0])) {
            $function = str_replace(" ", "", ucwords(str_replace("-", " ", strtolower($params[0]))));
            array_shift($params);
            if (is_file("../app/views/Objednavky/faktury" . $function . ".latte")) {
                call_user_func(array($this, "renderFaktury" . $function), $params);
            } else {
                $this->head['page_title'] = "Objednávky - Faktury";
                $this->head['page_keywords'] = "";
                $this->head['page_description'] = "";
                $this->setView('faktury');
            }
        } else {
            $this->head['page_title'] = "Objednávky - Faktury";
            $this->head['page_keywords'] = "";
            $this->head['page_description'] = "";
            $this->setView('faktury');
        }
    }

    private function renderFakturyNova($params)
    {
        $this->head['page_title'] = "Objednávky";
        $this->head['page_keywords'] = "";
        $this->head['page_description'] = "";
        $this->setView('fakturyNova', 'invoiceController');
    }

    private function renderFakturyData($params)
    {
        if (isset($params[0])) {
            if ($params[0] === "userInfo") {
                echo(json_encode(
                    $this->userManager->selectUsersInvoiceInfo($params[1])
                ));
            }
        } else {
            $users = $this->userManager->selectUsersEmails();
            $dopravy = $this->orderManager->selectShippingVariants();
            $platby = $this->orderManager->selectPaymentVariants();
            $orderNumber = $this->orderManager->newOrderNumber();
            $eshopInfo = $this->orderManager->selectEshopInvoiceInfo();
            $this->data = ["payments" => $platby, "shipping" => $dopravy, "users" => $users, "number" => $orderNumber, "eshopInfo" => $eshopInfo];
            echo(json_encode(
                $this->data
            ));
        }
    }

    private function renderFakturyHledatprodukty($params)
    {
        $produkty = $this->productManager->searchProducts($params[0]);
        echo(json_encode(
            $produkty
        ));
    }
}
