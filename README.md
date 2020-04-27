<DOCTYPE html>
  <head>
  </head>
  <body>
    <h1>AnimeStats</h1>
    <h2># Améliorations depuis la soutenance (fin le 27 Avril) :</h2>
    <h3>Mise à jour du back-end : <ul>
      <li>Nous gérons nos requettes grâce à Jquerry et ses requettes AJAX, nous les utilisons de manière asynchrone pour eviter de ralentir la page.</li>
      <li>Lorsqu'un utilisateur choisit un nom d'anime dans la barre de recherche, on regarde s'il est déja présent dans la BDD et sinon on procède a l'envoie de requette pour remplir la BDD pour ensuite modifier l'affichage.</li>
      <li>L'API kitsu (pour recupérer les infos d'un anime) fonctionne parfaitement sur notre site et met bien à jour les infos selon les recherches.</li>
      <li>L'API twitter demandant une authentification a posé plus de problèmes et n'est actuellement pas fonctionnelle, nous ne recupéront pas encore de fichier JSON correct. Les fichiers peuvent être récuperés avec le Bearer Token sur Postman ou sur le terminal, mais ne marche pas avec le setHeader avec AJAX.</li>
      <li>Pour la carte nous utlisons toujours Google MyMaps qui n'est pas une API mais qui permet de mettre à jour une carte en ligne pour y indiquer les évenements du fait des recents changement qu'il y a eu sur l'API Google Maps.</li>
    </ul></h3>
    <h2>~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~</h2>
    <h2>Projet de L3 INFO - Architecture Web</h3>
      <h3>Projet par : <ul>
      <li> Lijuan Jiang</li>
      <li> Eliot Lepoittevin</li> 
      <li> Benjamin Riviere</li> 
    </ul></h2>
    <p>AnimeStats permettra de voir les statistiques et information de vos animes préféres.</p>
  </body>
</html>
