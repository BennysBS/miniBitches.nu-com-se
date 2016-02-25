'use strict';

var benny = benny || {};
benny.danseVideos = [
    'mb12.mp4',
    'mb11.mp4',
    'mb10.mp4',
    'mb9.mp4',
    'mb8.mp4',
    'mb7.mp4',
    'mb6.mp4',
    'mb5.mp4'
];
var totalVotesView = null;
var ranksView = null;
benny.danceUrl = 'http://minibitches.se/danceVideos/'; //http://minibitches.se/
benny.init = function(){
    console.log('http://nollning.spiik.com/');

    benny.danceView();
    benny.jukeboxView();
    benny.makeRequest('http://188.166.26.125:3334/api/contestants', 'GET')
    .then(function(d){

        var arr = [];
        for (var v in d) {
            arr.push(d[v]);
        }
        var totalPoints = 0;
        arr.forEach(function(item){
            totalPoints+= item.points;
        });
        totalVotesView = benny.totalVotesView(totalPoints);
        ranksView = benny.rankView(arr);
    });
};

benny.updateStats = function(){
    benny.makeRequest('http://188.166.26.125:3334/api/contestants', 'GET')
    .then(function(d){

        var arr = [];
        for (var v in d) {
            arr.push(d[v]);
        }
        var totalPoints = 0;
        arr.forEach(function(item){
            totalPoints+= item.points;
        });
        if(totalVotesView !== null && ranksView !== null){
            totalVotesView.updatePoints(totalPoints);
            ranksView.updateItems(arr);
        }

    });

};

benny.makeRequest = function(url, method){
    return new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest(null);
        request.open(method, url, true);
        request.timeout = 5750;
        request.send();

        request.addEventListener('load', function(event) {
            return resolve(JSON.parse(this.response));
        });
        // connection error
        request.addEventListener('error', function(){
            return reject();
        }.bind(this));
        // time out
        request.addEventListener('timeout', function(){
            return reject();
        }.bind(this));
    });

};

benny.rankView = function(items){
    return new Vue({
        el: '#rankView',
        data: {
            items:items
        },
        methods: {
            updateItems: function(arr){

                this.$data.items = arr;
            }
        },
        attached: function(){
        }
    });
};

benny.totalVotesView = function(data){
    return new Vue({
        el: '#totalVotesView',
        data: {
            totpoints: data
        },
        methods: {
            updatePoints: function(p){
                this.$data.totpoints = p;
            }
        },
        attached: function(){
        }
    });
};

benny.musiklist = [
    'Benny-Hill-Theme.mp3.mp3',
    'MinBitches.mp3.mp3',
];
benny.jukeboxView = function(data){
    var folder = 'audio/';
    return new Vue({
        el: '#jukebox',
        data: data,
        methods: {
            songOne: function(){
                this.$els.intromusic.src = folder+benny.musiklist[0];
            },

            songTwo: function(){
                this.$els.intromusic.src = folder+benny.musiklist[1];
            }
        },
        attached: function(){
            this.$els.intromusic.play();
        }
    });
};

benny.danceView = function(DanceContender, data){
    //benny.danceUrl
    return new Vue({
        el: '#danceView',
        data: {
            contestantOne: null,
            contestantTwo: null,
            showInfo: true
        },

        methods: {
            cOneWinner: function(){
                let id = this.$els.contestantTwo.dataset.name;

                this.$els.contestantOne.classList.add('spinMe');
                setTimeout(function(){
                    this.$els.contestantOne.classList.remove('spinMe');
                    this.drawNew();
                    this.requestWebb(id.split('.')[0]);
                }.bind(this), 500);
            },

            cTwoWinner: function(){
                let id = this.$els.contestantTwo.dataset.name;

                this.$els.contestantTwo.classList.add('spinMe');
                setTimeout(function(){
                    this.$els.contestantTwo.classList.remove('spinMe');
                    this.drawNew();
                    this.requestWebb(id.split('.')[0]);
                }.bind(this), 500);
            },

            rInfo: function(){
                this.drawNew();
                this.$data.showInfo = false;
            },

            drawNew: function(){
                var itemTwo = this.randomVideo();
                var itemOne = this.randomVideo();

                while (itemTwo === itemOne) {
                    itemOne = this.randomVideo();
                }

                this.$data.contestantTwo = benny.danceUrl+itemTwo;
                this.$els.contestantTwo.dataset.name = itemTwo;

                this.$data.contestantOne = benny.danceUrl+itemOne;
                this.$els.contestantOne.dataset.name = itemOne;

                this.$els.contestantOne.load();
                this.$els.contestantTwo.load();
                this.$els.contestantOne.play();
                this.$els.contestantTwo.play();


            },

            requestWebb(id){
                benny.makeRequest('http://188.166.26.125:3334/api/vote/'+id, 'POST')
                .then(function(d){
                    benny.updateStats();
                });
            },

            randomVideo: function(){
                return benny.danseVideos[Math.floor(Math.random()*benny.danseVideos.length)];
            },

            drawDontPlay(callback){
                var itemTwo = this.randomVideo();
                var itemOne = this.randomVideo();

                while (itemTwo === itemOne) {
                    itemOne = this.randomVideo();
                }

                this.$data.contestantTwo = benny.danceUrl+itemTwo;
                this.$els.contestantTwo.dataset.name = itemTwo;

                this.$data.contestantOne = benny.danceUrl+itemOne;
                this.$els.contestantOne.dataset.name = itemOne;
                callback();
            }

        },

        ready: function(){
            this.drawNew();

            /*this.drawDontPlay(function(){
                this.$els.contestantOne.load();
                this.$els.contestantTwo.load();
                this.$els.contestantOne.play();
                this.$els.contestantTwo.play();
            }.bind(this));*/
        },
        attached: function(){
            var intromusik = document.querySelector('#intromusic');

            this.$els.contestantOne.addEventListener('mouseover', function(){
                intromusik.muted = true;
                this.muted = false;
            }, false);

            this.$els.contestantOne.addEventListener('mouseout', function(){
                intromusik.muted = false;
                this.muted = true;
            }, false);

            this.$els.contestantTwo.addEventListener('mouseover', function(){
                intromusik.muted = true;
                this.muted = false;
            }, false);

            this.$els.contestantTwo.addEventListener('mouseout', function(){
                intromusik.muted = false;
                this.muted = true;
            }, false);

        }
    });
};

benny.mountCard = function (place) {
    this.cardView.$mount().$appendTo(place);
};

window.onload = benny.init();
