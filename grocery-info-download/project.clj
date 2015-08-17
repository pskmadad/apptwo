(defproject grocery-info-download "0.1.0-SNAPSHOT"
  :description "A bacth job to download grocry item details from other grocery websites."
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.7.0"]
                 [clj-http-lite "0.3.0"]
                 [org.jsoup/jsoup "1.8.3"]
                 [org.clojure/data.csv "0.1.3"]
                 ]
  :plugins [[lein-cljfmt "0.3.0"]]
  :main ^:skip-aot grocery-info-download.core
  :target-path "target/%s"
  :profiles {:uberjar {:aot :all}})
