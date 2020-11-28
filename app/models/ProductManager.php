<?php


namespace app\models;

use app\models\DbManager as DbManager;
use DateTime;
use Exception;


/**
 * Manager ProductManager
 *
 * @package app\models
 */
class ProductManager
{
    /**
     * Selects all products, discounted, with images
     *
     * @param int $offset
     * @param int $limit
     *
     * @return array
     * @throws Exception
     */
    public function selectProducts(int $offset = 0, int $limit = 60)
    {
        $offset = $offset * $limit;
        $products = DbManager::requestMultiple(
            'SELECT id,name,dash_name,price,amount,on_sale,dostupnost_id,visible FROM product 
        LIMIT ?
        OFFSET ?
        ;',
            [$limit, $offset]
        );
        $newProducts = array();
        foreach ($products as $product) {
            $mainImage = DbManager::requestUnit(
                'SELECT CONCAT(image.name,".",image.data_type) AS main_image 
                FROM image JOIN image_has_product 
                ON image.id = image_has_product.image_id 
                JOIN product ON product.id=image_has_product.product_id 
                WHERE product.id=?
                AND image_has_product.main_image = 1',
                [$product["id"]]);
            if (!$mainImage) {
                $mainImage = "default.jpg";
            }
            $product["main_image"] = $mainImage;

            $dostupnost = DbManager::requestUnit(
                'SELECT dostupnost.name 
                FROM dostupnost JOIN product
                ON dostupnost.id = product.dostupnost_id 
                WHERE product.id=?',
                [$product["id"]]);
            $product["dostupnost"] = $dostupnost;
            unset($product["dostupnost_id"]);

            $newProducts[$product["id"]] = $product;
        }
        return $newProducts;
    }

    public function productExists($id): bool
    {
        return DbManager::requestExists("id", "product", $id);
    }

    public function selectProduct($id)
    {
        $product = DbManager::requestSingle("SELECT * FROM product WHERE id = ?", [$id]);
        $dostupnost = DbManager::requestUnit('SELECT d.name FROM dostupnost d JOIN product p ON d.id = p.dostupnost_id  WHERE p.id=?', [$product["id"]]);
        $images = DbManager::requestMultiple('SELECT i.id, i.name, i.data_type FROM image i JOIN image_has_product ihp on i.id = ihp.image_id JOIN product p on p.id = ihp.product_id WHERE p.id=?', [$product["id"]]);
        $discount = DbManager::requestSingle('SELECT d.id, d.amount, d.type, d.from, d.to FROM discount d WHERE product_id=?', [$product["id"]]);
        $parameters = DbManager::requestMultiple('SELECT pa.id, pa.name, pa.type FROM parameter pa JOIN parameter_has_product php on pa.id = php.parameter_id JOIN product pr on php.product_id = pr.id WHERE pr.id=?', [$product["id"]]);
        $categories = DbManager::requestMultiple('SELECT c.id,c.name,c.dash_name,c.visible,c.category_id FROM category c JOIN category_has_product chp on c.id = chp.category_id JOIN product p on chp.product_id = p.id WHERE p.id=?', [$product["id"]]);
        $variant_id = DbManager::requestUnit('SELECT v.id FROM product_variant v JOIN product_variant_has_product pvhp on v.id = pvhp.product_variant_id JOIN product p on p.id = pvhp.product_id WHERE p.id = ?', [$product["id"]]);
        $variants = DbManager::requestMultiple("SELECT pr.id, pr.name, pr.dash_name, pr.price, pr.amount, pr.dostupnost_id, pr.visible, pr.on_sale FROM product pr JOIN product_variant_has_product pvhp on pr.id = pvhp.product_id JOIN product_variant pv on pvhp.product_variant_id = pv.id WHERE pv.id=?", [$variant_id]);
        $newVariants = array();
        foreach ($variants as $variant) {
            $mainImage = DbManager::requestUnit(
                'SELECT CONCAT(image.name,".",image.data_type) AS main_image 
                FROM image JOIN image_has_product 
                ON image.id = image_has_product.image_id 
                JOIN product ON product.id=image_has_product.product_id 
                WHERE product.id=?
                AND image_has_product.main_image = 1',
                [$variant["id"]]);
            if (!$mainImage) {
                $mainImage = "default.jpg";
            }
            $variant["main_image"] = $mainImage;

            $dostupnost = DbManager::requestUnit(
                'SELECT dostupnost.name 
                FROM dostupnost JOIN product
                ON dostupnost.id = product.dostupnost_id 
                WHERE product.id=?',
                [$variant["id"]]);
            $variant["dostupnost"] = $dostupnost;
            unset($variant["dostupnost_id"]);

            $newVariants[$variant["id"]] = $variant;
        }
        $product["dostupnost"] = $dostupnost;
        $product["images"] = $images;
        $product["discount"] = $discount;
        $product["parameters"] = $parameters;
        $product["categories"] = $categories;
        $product["variant_id"] = $variant_id;
        $product["variants"] = $newVariants;
        return $product;
    }

    public function searchProducts($value)
    {
        $value = urldecode($value);
        $products = (DbManager::requestMultiple("SELECT id,name,dash_name as dashName FROM product WHERE name LIKE ?", ["%" . $value . "%"]));
        $newProducts = array();
        foreach ($products as $product) {
            $image = DbManager::requestSingle(
            'SELECT CONCAT(image.name,".",image.data_type) as image FROM image 
            JOIN image_has_product ihp on image.id = ihp.image_id 
            JOIN product p on ihp.product_id = p.id 
            WHERE p.id = ? AND ihp.main_image=1',
                [$product["id"]]);
            if(!$image){
                $image="default.jpg";
            }else{
                $image = $image["image"];
            }
            $product["image"] = $image;
            $newProducts[] = $product;
        }
        return $newProducts;

    }

    public function getProductInvoiceInfo($value)
    {
        $value = urldecode($value);
        $products = (DbManager::requestMultiple("SELECT id,name,dash_name as dashName, price, dph FROM product WHERE dash_name = ?", [$value]));
        $newProducts = array();
        foreach ($products as $product) {
            $product["image"] = DbManager::requestSingle("SELECT CONCAT(image.name+image.data_type) FROM image JOIN image_has_product ihp on image.id = ihp.image_id JOIN product p on ihp.product_id = p.id WHERE p.id = ? AND ihp.main_image=1" [$product["id"]]);
            $newProducts[] = $product;
        }
        return $newProducts;
    }
}