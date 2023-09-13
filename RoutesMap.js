function loadMapScenario() {
    var map = new Microsoft.Maps.Map(document.getElementById('myMap'), {
        credentials: '',
        center: new Microsoft.Maps.Location(0.0, 0.0),
        zoom: 1
    });

    ///////////////////////////////////////////////////////////////////////

    var geoDataRequestOptions = {
        entityType: 'CountryRegion'
    };

    //Load the Bing Spatial Data Services module.
    Microsoft.Maps.loadModule('Microsoft.Maps.SpatialDataService', function () {

        //Use the GeoData API manager to get the boundaries of the zip codes.
        Microsoft.Maps.SpatialDataService.GeoDataAPIManager.getBoundary(
            new Microsoft.Maps.Location(79.76148, 24.42578),
            geoDataRequestOptions,
            map,
            function (data) {
                //Add the polygons to the map.
                if (data.results && data.results.length > 0) {
                    map.entities.push(data.results[0].Polygons);
                }
            });
    });

    ///////////////////////////////////////////////////////////////////////

    Microsoft.Maps.loadModule("Microsoft.Maps.SpatialMath", function () {

        ///////////////////////////////////////////////////////////////////////

        class Route {
            constructor(map, loc1, loc2) {
                this.name1 = loc1.getName();
                this.point1 = loc1.getLocation();
                this.name2 = loc2.getName();
                this.point2 = loc2.getLocation();
                this.midpoint = Microsoft.Maps.SpatialMath.interpolate(this.point1, this.point2);
                this.distance = Microsoft.Maps.SpatialMath.getDistanceTo(this.point1, this.point2, Microsoft.Maps.SpatialMath.DistanceUnits.Kilometers).toFixed(0);
                this.infobox = new Microsoft.Maps.Infobox(this.midpoint, {
                    title: this.name1 + " - " + this.name2,
                    description: this.distance + " km",
                    visible: false
                });
                this.infobox.setMap(map);
                this.coords = [this.point1, this.point2];
                this.path = Microsoft.Maps.SpatialMath.getGeodesicPath(this.coords);
                this.polyLine = new Microsoft.Maps.Polyline(this.path, {
                    strokeColor: 'black',
                    strokeThickness: 1,
                    strokeDashArray: [4, 4]
                });
                map.entities.push(this.polyLine);
                Microsoft.Maps.Events.addHandler(this.polyLine, 'mouseover', () => {
                    this.mouseOn();
                });
                Microsoft.Maps.Events.addHandler(this.polyLine, 'mouseout', () => {
                    this.mouseOff();
                });
            }

            mouseOn() {
                this.changeLine('red');
                this.changeInfoboxVisibility(true);
            }

            mouseOff() {
                this.changeLine('black');
            }

            changeInfoboxVisibility(visibility) {
                this.infobox.setOptions({
                    visible: visibility
                });
            }

            changeLine(color) {
                this.polyLine.setOptions({
                    strokeColor: color
                })
            }
        }

        ///////////////////////////////////////////////////////////////////////

        class GeoLocation {
            constructor(map, name, coord1, coord2, color) {
                this.name = name;
                this.color = color;
                this.location = new Microsoft.Maps.Location(coord1, coord2);
                this.pin = new Microsoft.Maps.Pushpin(this.location, {
                    title: this.name,
                    color: this.color
                });
                map.entities.push(this.pin);
            }

            getName () {
                return this.name;
            }

            getLocation () {
                return this.location;
            }
        }

        ///////////////////////////////////////////////////////////////////////

        var center = map.getCenter();

        ///////////////////////////////////////////////////////////////////////

        var citySeattle = new GeoLocation(map, 'Seattle', 47.60357, -122.32945, 'green');
        var cityMinsk = new GeoLocation(map, 'Minsk', 53.90378, 27.55139, 'blue');
        var cityAuckland = new GeoLocation(map, 'Auckland', -36.84979, 174.76428, 'black');
        var cityCapeTown = new GeoLocation(map, 'Cape Town', -33.96396, 18.58465, 'yellow');
        var islandTahiti = new GeoLocation(map, 'Tahiti', -17.55807, -149.61070, 'maroon');
        var cityAustin = new GeoLocation(map, 'Austin', 30.31303, -97.72634, 'orange');
        var cityParis = new GeoLocation(map, 'Paris', 48.85760, 2.36000, 'fuchsia');
        var cityLondon = new GeoLocation(map, 'London', 51.49663, -0.11456, 'sienna');
        var cityNewYork = new GeoLocation(map, 'New York', 40.76314, -73.93701, 'cyan');
        var cityDubai = new GeoLocation(map, 'Dubai', 25.21921, 55.27613, 'lime');
        var cityMoscow = new GeoLocation(map, 'Moscow', 55.73132, 37.62627, 'gray');
        var cityRio = new GeoLocation(map, 'Rio de Janeiro', -22.86346, -43.24522, 'teal');
        var cityHongKong = new GeoLocation(map, 'Hong Kong', 22.32822, 114.19182, 'navy');
        var cityTokyo = new GeoLocation(map, 'Tokyo', 35.69857, 139.78645, 'red');
        var cityCasablanca = new GeoLocation(map, 'Casablanca', 33.57441, -7.57271, 'indianred');
        var citySydney = new GeoLocation (map, 'Sydney', -33.89451, 151.19452, 'forestgreen');

        ///////////////////////////////////////////////////////////////////////

        var routeMinskTahiti = new Route(map, cityMinsk, islandTahiti);
        var routeMinskSeattle = new Route(map, cityMinsk, citySeattle);
        var routeMinskAuckland = new Route(map, cityMinsk, cityAuckland);
        var routeMinskCapeTown = new Route(map, cityMinsk, cityCapeTown);
        var routeSeattleAustin = new Route(map, citySeattle, cityAustin);
        var routeMinskMoscow = new Route(map, cityMinsk, cityMoscow);
        var routeDubaiRio = new Route(map, cityDubai, cityRio);
        var routeTahitiCapeTown = new Route(map, islandTahiti, cityCapeTown);
        var routeNewYorkAustin = new Route(map, cityNewYork, cityAustin);
        var routeParisNewYork = new Route (map, cityParis, cityNewYork);
        var routeSydneyNewYork = new Route(map, citySydney, cityNewYork);
        var routeLondonSydney = new Route(map, cityLondon, citySydney);
        var routeLondonMoscow = new Route(map, cityLondon, cityMoscow);
        var routeSydneyAuckland = new Route(map, citySydney, cityAuckland);
        var routeAucklandTahiti = new Route(map, cityAuckland, islandTahiti);
        var routeDubaiHongKong = new Route(map, cityDubai, cityHongKong);
        var routeCasablancaParis = new Route(map, cityCasablanca, cityParis);
        var routeParisMinsk = new Route(map, cityParis, cityMinsk);
        var routeLondonDubai = new Route(map, cityLondon, cityDubai);
        var routeNewYorkSeattle = new Route(map, cityNewYork, citySeattle);
        var routeMoscowTokyo = new Route(map, cityMoscow, cityTokyo);
        var routeNewYorkRio = new Route(map, cityNewYork, cityRio);
        var routeParisLondon = new Route(map, cityParis, cityLondon);
        var routeLondonNewYork = new Route(map, cityLondon, cityNewYork);

    });
}