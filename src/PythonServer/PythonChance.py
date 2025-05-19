#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import cgi, cgitb
import csv
import sys
import codecs
import os
import json

# Active le débogage CGI
cgitb.enable()

# Force la sortie en UTF-8 pour l'affichage des caractères spéciaux
if sys.version_info >= (3, 0):
    sys.stdout = codecs.getwriter("utf-8")(sys.stdout.buffer)
else:
    sys.stdout = codecs.getwriter("utf-8")(sys.stdout)

# En-tête HTTP
print("Content-type:text/html\r\n\r\n")

# Récupération des données du formulaire
formulaire = cgi.FieldStorage()

# Détermine le mode de fonctionnement (chances ou palmarès)
mode = "chances"
if "formation2" in formulaire:
    mode = "palmares"
    formation = formulaire.getvalue("formation2", "")
    spec1 = None
    spec2 = None
else:
    spec1 = formulaire.getvalue("spec1", "")
    spec2 = formulaire.getvalue("spec2", "")
    formation = formulaire.getvalue("formation", "")

# Début de la page HTML
print('''
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Résultats Parcoursup</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    <style>
        .success-rate {
            font-size: 3rem;
            font-weight: bold;
            color: #007bff;
        }
        .rate-high {
            background-color: #d4edda;
            color: #155724;
        }
        .rate-medium {
            background-color: #fff3cd;
            color: #856404;
        }
        .rate-low {
            background-color: #f8d7da;
            color: #721c24;
        }
        .specialty-card {
            transition: all 0.3s ease;
        }
        .specialty-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .result-container {
            animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body>
<div class="container mt-4 mb-5">
''')

# Titre différent selon le mode
if mode == "chances":
    print(f'<h3 class="mb-4">Résultats pour : {spec1} + {spec2} → {formation}</h3>')
else:
    print(f'<h3 class="mb-4">Meilleures spécialités pour : {formation}</h3>')

# Chemin vers le fichier CSV - utilisons un chemin relatif
csv_file = "parcoursup.csv"
# Essayons plusieurs emplacements possibles
possible_paths = [
    csv_file,
    os.path.join("cgi-bin", csv_file),
    os.path.join("..", "cgi-bin", csv_file),
    os.path.join("/", "laragon", "www", "nsi", "cgi-bin", csv_file)
]

file_found = False

# Fonction pour calculer les statistiques
def process_data(csv_reader, mode, spec1=None, spec2=None, formation=None):
    if mode == "chances":
        return process_chances(csv_reader, spec1, spec2, formation)
    else:
        return process_best_specialties(csv_reader, formation)

# Fonction pour le mode "chances d'admission"
def process_chances(csv_reader, spec1, spec2, formation):
    total_candidats = 0
    total_acceptes = 0
    stats_par_annee = {}
    
    for ligne in csv_reader:
        # Récupérer les colonnes importantes
        annee = ligne.get("Année du Baccalauréat", "")
        specialites = ligne.get("Enseignements de spécialité", "").split(",")
        formation_csv = ligne.get("Formation", "")
        
        # Vérifier si les spécialités et la formation correspondent
        specialites_match = (spec1 in specialites and spec2 in specialites)
        formation_match = formation.strip().lower() == formation_csv.strip().lower()
        
        if specialites_match and formation_match:
            confirmes = int(float(ligne.get("Nombre de candidats bacheliers ayant confirmé au moins un vœu", 0)))
            acceptes = int(float(ligne.get("Nombre de candidats bacheliers ayant reçu au moins une proposition d'admission", 0)))
            
            total_candidats += confirmes
            total_acceptes += acceptes
            
            pourcentage = round((acceptes / confirmes) * 100, 2) if confirmes > 0 else 0
            stats_par_annee[annee] = pourcentage
    
    return {
        "stats_par_annee": stats_par_annee,
        "total_candidats": total_candidats,
        "total_acceptes": total_acceptes
    }

# Fonction pour le mode "meilleures spécialités"
def process_best_specialties(csv_reader, formation):
    combinations = {}
    
    for ligne in csv_reader:
        formation_csv = ligne.get("Formation", "")
        
        if formation.strip().lower() == formation_csv.strip().lower():
            specialites = ligne.get("Enseignements de spécialité", "")
            confirmes = int(float(ligne.get("Nombre de candidats bacheliers ayant confirmé au moins un vœu", 0)))
            acceptes = int(float(ligne.get("Nombre de candidats bacheliers ayant reçu au moins une proposition d'admission", 0)))
            
            if specialites not in combinations:
                combinations[specialites] = {"confirmes": 0, "acceptes": 0}
            
            combinations[specialites]["confirmes"] += confirmes
            combinations[specialites]["acceptes"] += acceptes
    
    # Calculer les taux et trier
    results = []
    for combo, stats in combinations.items():
        if stats["confirmes"] >= 10:  # Seulement les combinaisons avec suffisamment de données
            rate = round((stats["acceptes"] / stats["confirmes"]) * 100, 2) if stats["confirmes"] > 0 else 0
            results.append({
                "combo": combo,
                "confirmes": stats["confirmes"],
                "acceptes": stats["acceptes"],
                "rate": rate
            })
    
    # Trier par taux d'admission (du plus haut au plus bas)
    results.sort(key=lambda x: x["rate"], reverse=True)
    
    return results[:10]  # Top 10

# Essayer de lire le fichier CSV à partir des différents chemins possibles
for path in possible_paths:
    try:
        with open(path, encoding="utf-8-sig") as f:
            reader = csv.DictReader(f, delimiter=';')
            
            if mode == "chances":
                result = process_chances(reader, spec1, spec2, formation)
                
                stats_par_annee = result["stats_par_annee"]
                total_candidats = result["total_candidats"]
                total_acceptes = result["total_acceptes"]
                
                # Affichage HTML des résultats
                if stats_par_annee:
                    total_pct = round((total_acceptes / total_candidats) * 100, 2) if total_candidats > 0 else 0
                    
                    # Définir la classe de couleur selon le taux
                    rate_class = "rate-high" if total_pct >= 70 else "rate-medium" if total_pct >= 40 else "rate-low"
                    
                    print('<div class="result-container">')
                    print('<div class="card mb-4">')
                    print('<div class="card-body text-center">')
                    print(f'<div class="success-rate">{total_pct}%</div>')
                    print(f'<p class="lead">Taux d\'admission global</p>')
                    print('</div>')
                    print('</div>')
                    
                    print('<div class="card mb-4">')
                    print(f'<div class="card-header {rate_class}">')
                    
                    if total_pct >= 70:
                        print('<strong>Très bonnes chances !</strong> Cette combinaison est très favorable.')
                    elif total_pct >= 40:
                        print('<strong>Chances moyennes.</strong> Cette combinaison peut fonctionner avec un bon dossier.')
                    else:
                        print('<strong>Chances limitées.</strong> Cette combinaison est statistiquement peu favorable.')
                    
                    print('</div>')
                    print('<div class="card-body">')
                    print(f'<p>Sur <strong>{total_candidats}</strong> candidats ayant cette combinaison, <strong>{total_acceptes}</strong> ont reçu une proposition d\'admission.</p>')
                    
                    print('<h5 class="mt-4">Détail par année :</h5>')
                    print('<ul class="list-group">')
                    for annee, pct in stats_par_annee.items():
                        year_class = "list-group-item-success" if pct >= 70 else "list-group-item-warning" if pct >= 40 else "list-group-item-danger"
                        print(f'<li class="list-group-item {year_class}">{annee} : <strong>{pct}%</strong> de candidats acceptés</li>')
                    print('</ul>')
                    
                    print('</div>')
                    print('</div>')
                    print('</div>')
                else:
                    print('<div class="alert alert-warning">Aucune donnée trouvée pour cette combinaison de spécialités et formation.</div>')
            else:
                # Mode palmarès : meilleures spécialités
                best_combos = process_best_specialties(reader, formation)
                
                if best_combos:
                    print('<div class="result-container">')
                    print('<p class="lead mb-4">Voici les combinaisons de spécialités avec les meilleurs taux d\'admission :</p>')
                    
                    print('<div class="row">')
                    for i, combo in enumerate(best_combos):
                        specialites = combo["combo"].split(",")
                        spec_display = f"{specialites[0]} + {specialites[1]}" if len(specialites) >= 2 else combo["combo"]
                        
                        # Classes CSS pour le style
                        card_class = ""
                        if i == 0:
                            card_class = "border-success"
                        elif i == 1:
                            card_class = "border-primary"
                        elif i == 2:
                            card_class = "border-info"
                        
                        print(f'<div class="col-md-6 col-lg-4 mb-4">')
                        print(f'<div class="card specialty-card {card_class}">')
                        
                        if i < 3:
                            badge_color = "success" if i == 0 else "primary" if i == 1 else "info"
                            print(f'<div class="card-header bg-{badge_color} text-white">Top {i+1}</div>')
                        
                        print('<div class="card-body">')
                        print(f'<h5 class="card-title">{spec_display}</h5>')
                        print(f'<h2 class="card-text text-center mb-3">{combo["rate"]}%</h2>')
                        print(f'<p class="card-text">{combo["acceptes"]} admis sur {combo["confirmes"]} candidats</p>')
                        print('</div>')
                        print('</div>')
                        print('</div>')
                    
                    print('</div>')
                    print('</div>')
                else:
                    print('<div class="alert alert-warning">Aucune donnée trouvée pour cette formation.</div>')
            
            file_found = True
            break
            
    except FileNotFoundError:
        continue
    except Exception as e:
        print(f'<div class="alert alert-danger">Erreur lors du traitement des données : {str(e)}</div>')
        file_found = True
        break

if not file_found:
    print('<div class="alert alert-danger">Erreur : Le fichier de données est introuvable.</div>')

# Boutons pour revenir
print('<div class="mt-4">')
print('<a href="index.html" class="btn btn-primary mr-2">Retour à l\'accueil</a>')
if mode == "chances":
    print('<a href="index2.html" class="btn btn-outline-primary">Nouvelle recherche</a>')
else:
    print('<a href="index3.html" class="btn btn-outline-primary">Nouvelle recherche</a>')
print('</div>')

# Fin de la page HTML
print("</div></body></html>")