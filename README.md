# Permaculture Sorter API
![Title](/Images/permasortTitle.jpg)



## A brand new API
This is an innovating backend service for permaculture web tools' implementation. Made for simple use, this API is designed sort best vegetables to associate with the one you search. It uses wikipedia and orreka parsing to collect data about anything you want to see grow well in your garden, field, parc, etc... See getting started for more informations.

## Getting started
:arrow_down:   Download or clone the latest version and open it with visual studio code or your favorite IDE which support js and nodejs runtime environment. 

### Input
The API accept only one string output json formatted : the vegetable's name. The API is insensitive to common name or scientifical name, you can ask both of it.

### Output
JSON formatted string containing :

 * :sunflower: Vegetable name;
 * :low_brightness: Exposure
 * :family: Family
 * :sweat_drops: Water need
 * :left_right_arrow: Width
 * :arrow_up_down: Height
 * :eight_spoked_asterisk: Soil need
 * :keycap_ten: A match score


## How does it works?

It's simple ! See this API as a bot searching and formatting data for you on the internet. Demo : you are searching what vegetable / plant can be associated to your beautiful rose, you search "roses" in the searchbar and see what happend : 

 * Searching rose in wikipedia, scrapping scientific data from the result page (family name, order, etc...).
 * Searching rose in orreka, scrapping common data from the result page (exposure, water need, height, width, etc...)
 * Comparing data from the two websites
 * Pull common vegetables to associate with the rose
    * Searching vegetables in local database respecting permaculture rules (same exposure, not the same family, different height, etc...)
    * If the search vegetable doesn't exist, it will be register in the local database
 * Attaching one score per vegetable
 * Push data in json array if valid data
 * POST back the array to the client who asked a research

## Web demo implementation

You have to run the demo implementation with a virtual server like live server on vscode.
Run it and go to the http://localhost/index

![Alt text](/Images/permasortAPI.gif)

That's it, enjoy !

## About me

Mathéo Berger, 1rst year in engineering school major computer science at CESI Bordeaux, France.
<matheo.berger@viacesi.fr>


