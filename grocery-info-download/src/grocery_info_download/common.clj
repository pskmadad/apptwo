(ns grocery-info-download.common
  (:gen-class))

(defrecord ItemDetails [category_name
                        subcategory_name
                        name
                        mrp
                        source])
