<?php


namespace app\models;

use app\models\DbManager as DbManager;
use DateTime;
use Exception;


/**
 * Manager CategoryManager
 *
 * @package app\models
 */
class CategoryManager
{
    /**
     * Selects all products, discounted, with images
     *
     * @return array
     */
    public function selectCategories()
    {
        $mainCategories = DbManager::requestMultiple("SELECT id,name FROM category WHERE category_id is null ");
        return $this->subcategories($mainCategories);
    }

    public function selectSubcategories($id)
    {
        return DbManager::requestMultiple("SELECT * FROM category WHERE id = ?", [$id]);
    }

    public function categoryExists($id): bool
    {
        return DbManager::requestExists("id", "category", $id);
    }

    private function subcategories(array $categories)
    {
        $maincategory = [];
        foreach ($categories as $category) {
            $subcategories = DbManager::requestMultiple("SELECT id,name FROM category WHERE category_id = ?", [$category["id"]]);
            if($subcategories){
                $subcategories = $this->subcategories($subcategories);
            }else{
                $subcategories=[];
            }
            $maincategory[$category["id"]]["category"] = $category;
            $maincategory[$category["id"]]["subcategories"] = $subcategories;
        }
        return $maincategory;
    }
}