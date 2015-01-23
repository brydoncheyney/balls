(ns balls.data.go
  (:require [clj-cctray.core :as parser]
            [clj-cctray.filtering :as filtering]
            [clojure.string :refer [blank?]]))

(defn detect-server [projects]
  (if (some (fn [project] (re-find #" :: " (:name project))) projects) "go" ""))

(defn invalid-url? [url]
  (or (blank? url)
      (not (re-find #"https?://" url))))

(defn get-all-projects [url]
  ;(if (invalid-url? url) (throw (IllegalArgumentException. "Not a valid url")))

  (let [projects (parser/get-projects url {:normalise :all})
        server (detect-server projects)]
    (if (= server "go")
      {:server server :projects (parser/get-projects url {:normalise :all, :server :go})}
      {:server server :projects projects})))

(defn options-from-config [{:keys [serverType]}]
  (if (not (blank? serverType))
    {:normalise :all, :server (keyword serverType)}
    {:normalise :all}))

(defn get-interesting-projects [params]
  (if (invalid-url? (:cctray params)) (throw (IllegalArgumentException. "Not a valid url")))

  (->> (parser/get-projects (:cctray params) (options-from-config params))
       (filtering/interesting)
       (filtering/by-name (:includedProjects params))))
