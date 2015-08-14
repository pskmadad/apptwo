(ns grocery-info-download.core
  (:gen-class)
  (:require [grocery-info-download.chennai-basket :as cb])
  (:require [clojure.java.io :as io])
  (:require [clojure.data.csv :as csv]))


(defn extract-item-details [] (cb/extract-item-details))


(defn generate-price-report [name coll]
  (with-open [w (io/writer name)]
    (csv/write-csv w coll)))

(defn get-item-row [item]
  [(:name item)
   (:mrp item)
   (:category item)
   (:subcategory item)
   (:source item) ])

(defn -main
  [& args]
  (let [items (extract-item-details)
        rows (map get-item-row items)]
    (generate-price-report "mrp.csv" rows)))
