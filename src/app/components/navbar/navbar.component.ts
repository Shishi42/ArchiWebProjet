import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
//import { inflate } from 'zlib';

class Info {
    synopsis: string
    updateAt: string
    nbEpisode: string
    coverImage: string
    nom: string
    image: string
    rating: string
}


var counterAsync=0;


var infosBD: Array<Info>;
infosBD=new Array<Info>();

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})



export class NavbarComponent implements OnInit {
    private listTitles: any[];
    location: Location;
    mobile_menu_visible: any = 0;
    private toggleButton: any;
    private sidebarVisible: boolean;



    protected champRecherche: String;

    constructor(location: Location,  private element: ElementRef, private router: Router) {
        this.location = location;
        this.sidebarVisible = false;
        this.champRecherche="";
    }

    ngOnInit(){
      this.listTitles = ROUTES.filter(listTitle => listTitle);
      const navbar: HTMLElement = this.element.nativeElement;
      this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
      this.router.events.subscribe((event) => {
        this.sidebarClose();
         var $layer: any = document.getElementsByClassName('close-layer')[0];
         if ($layer) {
           $layer.remove();
           this.mobile_menu_visible = 0;
         }
     });
     
    }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function(){
            toggleButton.classList.add('toggled');
        }, 500);

        body.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        var $toggle = document.getElementsByClassName('navbar-toggler')[0];

        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
        const body = document.getElementsByTagName('body')[0];

        if (this.mobile_menu_visible == 1) {
            // $('html').removeClass('nav-open');
            body.classList.remove('nav-open');
            if ($layer) {
                $layer.remove();
            }
            setTimeout(function() {
                $toggle.classList.remove('toggled');
            }, 400);

            this.mobile_menu_visible = 0;
        } else {
            setTimeout(function() {
                $toggle.classList.add('toggled');
            }, 430);

            var $layer = document.createElement('div');
            $layer.setAttribute('class', 'close-layer');


            if (body.querySelectorAll('.main-panel')) {
                document.getElementsByClassName('main-panel')[0].appendChild($layer);
            }else if (body.classList.contains('off-canvas-sidebar')) {
                document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
            }

            setTimeout(function() {
                $layer.classList.add('visible');
            }, 100);

            $layer.onclick = function() { //asign a function
              body.classList.remove('nav-open');
              this.mobile_menu_visible = 0;
              $layer.classList.remove('visible');
              setTimeout(function() {
                  $layer.remove();
                  $toggle.classList.remove('toggled');
              }, 400);
            }.bind(this);

            body.classList.add('nav-open');
            this.mobile_menu_visible = 1;

        }
    };

    getTitle(){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      if(titlee.charAt(0) === '#'){
          titlee = titlee.slice( 1 );
      }

      for(var item = 0; item < this.listTitles.length; item++){
          if(this.listTitles[item].path === titlee){
              return this.listTitles[item].title;
          }
      }
      return 'Dashboard';
    }

    
    //methode appelé lors du clic sur le bouton recherche
    cherche(){
        let valBarreRecherche = (<HTMLInputElement> document.getElementById("barreRecherche")).value;
        alert("recherche Avec :"+valBarreRecherche);
        actuInfos(valBarreRecherche)
    }
    
    

}





//gere les actualisation de la page en fonction de la recherche effectué
function actuInfos(nom: String){
    //test si le nom est deja stocké dans la base de données
    var indiceInfoBD=estPresentBD(nom);
    if(indiceInfoBD!=-1){ 

        console.log("AFFICHAGE DIRECT CAR DEJA INFO BD");
        afficherInfo( infosBD[indiceInfoBD] );

    }else{

        console.log("ACCES API CAR PAS D'INFO BD");
        ActuWithAPI(nom);

    }

}


function estPresentBD(nom: String):number{
    for( var indice=0 ; indice < (infosBD.length-1) ; indice++ ){
        if(infosBD[indice].nom==nom){
            return indice;
        }
    }
    return -1;
}




//actualise tt les infos de la page avec la case de la BD entré en param
function afficherInfo(info: Info){

    (<HTMLInputElement> document.getElementById("infoTitre")).innerHTML=info.nom;

    (<HTMLInputElement> document.getElementById("infoImage")).src=info.image;

    (<HTMLInputElement> document.getElementById("infoRating")).innerHTML="<b>Rating : </b>"+info.rating+" / 100";

    (<HTMLInputElement> document.getElementById("infoEpisode")).innerHTML="<b>Episodes : </b>"+info.nbEpisode;

    (<HTMLInputElement> document.getElementById("infoSynopsis")).innerHTML="<b>Synopsis : </b>"+info.synopsis;

    (<HTMLInputElement> document.getElementById("infoUpdateAt")).innerHTML="<b>Mis à jour le </b>"+info.updateAt;


}


//recuperes tt les info dans les différentes API et les stock dans un champ de la BD
function ActuWithAPI(nom: String){
    counterAsync=0;
    //creation d'un champ que l'on va push dans la BD apres l'avoir complété grace aux requettes
    var info=new Info();

    //appel des API et remplissage au fur et a mesure de du champ.
    APIKitsu(nom,info);
    APITwitter(nom,info);

    
}





function APIKitsu(name :String,info: Info){

    $.ajax({

        url: "https://kitsu.io/api/edge/anime",

        data: {"filter[text]" : name},

        type: 'get',

        dataType: 'json',

        async: true,

        success: function(json) {

            if(json.data.length>0){
                var attrs=json.data[0].attributes;

                info.nom=attrs.titles.en;
                info.synopsis=attrs.synopsis;
                info.updateAt=attrs.updatedAt;
                info.image=attrs.coverImage.tiny;
                info.nbEpisode=attrs.episodeCount;
                info.rating=attrs.averageRating;


                console.log("kitsu"+counterAsync);
                callBackFonct(info);

            }else{
                //console.log(json.data);
                alert("Aucune info dans la BD ni dans l'API Kitsu pour "+name);
            }

        },

        error: function (xhr, status, error) {

            alert('Erreur HTTP '+xhr.responseText);

        }

    });

}


/*ça ne marche pas ce api*/
function APITwitter(nom :String,info: Info){
    //envois requette et recup info
    $.ajax({
        url: "https://api.twitter.com/1.1/search/tweets.json?q=?",
        type: "GET",
        data: { cursor: "-1", 
                screen_name: "twitterapi" },
        cache: false,
        dataType: 'json',
        /*chercher les textes de twitters*/
        success: function(data) { 
            //alert('hello!'); 
            var tweets = data.statuses;
            for(var i =0; i< tweets.length; i++){
                console.log(tweets[i].text);
            }
        },

        error: function(html) { /*alert(html);*/ },
        beforeSend: setHeader
    });

    /*Header permet avoir authorization à chaque fois untiliser l'api */
    function setHeader(xhr) {
        if(xhr && xhr.overrideMimeType) {
            xhr.overrideMimeType("application/j-son;charset=UTF-8");
        }
        //alert('1'); 
        xhr.setRequestHeader('Authorization','Bearer AAAAAAAAAAAAAAAAAAAAAG5YCgEAAAAAUGjlt1IEIW3mJPdjXy63I1qxnB0%3DtcaDsrj69CZX8Wo5G1kVi8IKVzDWCgvyIbRWVVTQ4E1vocK9m5');
    }
    //alert('2'); 
    
    
    console.log("twitter"+counterAsync);
    callBackFonct(info);


}


function callBackFonct(info: Info){
    counterAsync++;
    if(counterAsync==2){
        infosBD.push(info);
        afficherInfo( info );

        console.log(infosBD);
    }
}


