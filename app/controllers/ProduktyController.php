<?php

namespace app\controllers;

use app\models\CategoryManager;
use app\models\ProductManager;
use app\router\Router;
use Exception;

/**
 * Controller ProduktyController
 *
 * @package app\controllers
 */
class ProduktyController extends Controller
{

    private ProductManager $productManager;
    private CategoryManager $categoryManager;

    public function __construct()
    {
        parent::__construct();
        $this->productManager = new ProductManager();
        $this->categoryManager = new CategoryManager();
    }

    /**
     * Sets default homepage
     *
     * @param array      $params
     * @param array|null $gets
     *
     * @return void
     * @throws Exception
     */
    public function process(array $params, array $gets = null)
    {
        if (isset($params[0])) {
            $function = str_replace(" ", "", ucwords(str_replace("-", " ",strtolower($params[0]))));
            array_shift($params);
            if (is_file("../app/views/Produkty/" . $function . ".latte")) {
                call_user_func(array($this, "render" . $function), $params, $gets);
            } else {
                $this->renderSouhrn();
            }
        } else {
            $this->renderSouhrn();
        }

    }

    /**
     * @return void
     * @throws Exception
     */
    private function renderSouhrn()
    {
        $this->data["products"]=$this->productManager->selectProducts();
        $this->head['page_title'] = "Produkty";
        $this->head['page_keywords'] = "";
        $this->head['page_description'] = "";
        $this->setView('default');
    }
    private function renderDetail($params,$gets)
    {
        if(!$this->productManager->productExists($gets["id"])){
            Router::reroute("error/404");
        }
        $this->data["product"]=$this->productManager->selectProduct($gets["id"]);
        $this->head['page_title'] = "Produkty";
        $this->head['page_keywords'] = "";
        $this->head['page_description'] = "";
        $this->setView('detail');
    }
    private function renderKategorie()
    {
        $this->data["categories"] = $this->categoryManager->selectCategories();
        $this->head['page_title'] = "Produkty - Kategorie";
        $this->head['page_keywords'] = "";
        $this->head['page_description'] = "";
        $this->setView('kategorie');
    }

    private function renderCeny()
    {
        $this->head['page_title'] = "Produkty - Ceny";
        $this->head['page_keywords'] = "";
        $this->head['page_description'] = "";
        $this->setView('ceny');
    }

    private function renderSklad()
    {
        $this->head['page_title'] = "Produkty - Sklad";
        $this->head['page_keywords'] = "";
        $this->head['page_description'] = "";
        $this->setView('sklad');
    }

    private function renderSlevy()
    {
        $this->head['page_title'] = "Produkty - Slevy";
        $this->head['page_keywords'] = "";
        $this->head['page_description'] = "";
        $this->setView('slevy');
    }

    private function renderImport()
    {
        $this->head['page_title'] = "Produkty - Import";
        $this->head['page_keywords'] = "";
        $this->head['page_description'] = "";
        $this->setView('import');
    }
}
