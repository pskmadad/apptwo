(ns grocery-info-download.chennai-basket
  (:require [clj-http.lite.client :as client])
  (:require [clojure.string :as str])
  (:import [org.jsoup Jsoup])
  (:require [grocery-info-download.common :as c]))

(def categories
  [{:name "Grocery" :url "http://www.chennaibasket.com/Grocery-Staples"}
   {:name "Beverages" :url "http://www.chennaibasket.com/Beverages-Chennai"}
   {:name "Food Items" :url "http://www.chennaibasket.com/Food-online-Chennai"}
   {:name "Bread & Dairy" :url "http://www.chennaibasket.com/bread-diary-egg"}
   {:name "Household" :url "http://www.chennaibasket.com/Household-items"}
   {:name "Baby Care" :url "http://www.chennaibasket.com/Baby-care-Products"}
   {:name "Personal Care" :url "http://www.chennaibasket.com/Personal-Care"}])

(declare get-html
         extract-item-details-for-category
         extract-item-details-for-subcategory
         extract-subcategory-details
         get-subcategory-details
         get-item-details)

; - find categories
; - find subcateogries of each category
; - find items from each sub category


(defn extract-item-details []
  (let [item-details (doall (map #(future (extract-item-details-for-category %))
                                 categories))]
    (flatten (map deref item-details))))

(defn extract-item-details-for-category [category]
  (let [subcategories (extract-subcategory-details category)]
    (flatten (map extract-item-details-for-subcategory subcategories))))

(defn extract-item-details-for-subcategory [subcategory]
  (let [html (get-html (:url subcategory))
        doc (Jsoup/parse html)
        items (.select doc "div.three.mobile-two.columns")]
    (map (fn [item]
           (conj {:subcategory (:name subcategory) :category (:category subcategory)}
                 (get-item-details item)))
         items)))

(defn extract-subcategory-details [category]
  (let [html (get-html (:url category))
        doc (Jsoup/parse html)
        subcategories (.select doc "ul.box-category a")]
    (map (fn [subcategory]
           (conj {:category (:name category)} (get-subcategory-details subcategory)))
         subcategories)))

(defn get-subcategory-details [elmt]
  {:name (.text elmt)
   :url (.attr elmt "href")
   :source "chennaibasket"})

(defn find-price-element
  "Finds price element as some items has 'price-old' and other has 'price'"
  [elmt]
  (let [price-old-elm (.select elmt ".price-old")]
    (if (.isEmpty price-old-elm)
      (.select elmt ".price")
      price-old-elm)))

(defn find-mrp
  "Find mrp from given item element"
  [elmt]
  ; Remove the text "Rs." from the price value
  (str/replace (.text (find-price-element elmt))
               #"Rs\."
               ""))

(defn get-item-details
  "Get item details from given element"
  [elmt]
  {:name  (.text (.select elmt ".name"))
   :mrp  (find-mrp elmt)})

(defn get-html [url]
  (:body (client/get url {:follow-redirects false})))
