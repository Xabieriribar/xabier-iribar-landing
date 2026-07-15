# Décisions de conception et d’architecture

Dernière mise à jour : 15 juillet 2026.

## Audit initial et plan

Le dépôt initial construisait trois routes statiques (`/`, `/diagnostic`, `/merci`) avec Astro 6.3.1, Tailwind CSS 4, du CSS Astro et un endpoint Vercel/Resend séparé. Le build passait, mais signalait un chunk Three.js minifié de 542 Ko. La page d’accueil générée pesait 88 Ko de HTML, le portrait 2,06 Mo et plusieurs visuels inutilisés entre 350 et 637 Ko. `npm audit` signalait cinq vulnérabilités (une faible, une modérée, trois élevées) dans la chaîne Astro/Vite.

Les principaux écarts observés étaient : gains de temps et de conversion non sourcés, « zéro risque », délai de 48 heures, réponse sous 24 heures, promesse de rentrer à 17 h, logos intitulés « collaborations » sans preuve, organisations sans lien identitaire placées dans `sameAs`, formulaire JavaScript dépendant de `/api/contact`, polices Google, navigation mobile couvrante, animation continue sans arrêt hors champ et attribut SVG malformé (`ccx`).

Plan d’exécution :

1. centraliser l’identité, les offres, la navigation et les variables publiques ;
2. remplacer le système visuel par une interface d’ordre de travail, mobile-first ;
3. construire les routes commerciales, légales et de contact requises ;
4. migrer vers un formulaire HTML externe et une réservation chargée à la demande ;
5. ajouter la collection de cas et exclure les brouillons ;
6. finaliser SEO, accessibilité, performance, tests et documentation Infomaniak.

## 1. Héros Three.js

- **Décision** : supprimer Three.js et remplacer la carte 3D par un schéma SVG statique de flux d’intervention.
- **Raison** : le chunk minifié de 542 Ko dépassait à lui seul le budget JavaScript et n’expliquait pas l’offre.
- **Alternative rejetée** : chargement différé de Three.js ; le coût restait disproportionné et le bénéfice commercial non mesuré.
- **Conséquence** : aucun JavaScript graphique initial, meilleure compréhension et animation non essentielle supprimée.

## 2. Tailwind CSS

- **Décision** : conserver la chaîne Tailwind 4 installée, mais utiliser principalement un CSS global simple et des styles Astro ciblés.
- **Raison** : Tailwind est compilé au build et ne crée pas de dépendance client ; une migration idéologique n’apporterait aucun gain utilisateur.
- **Alternative rejetée** : supprimer toute la chaîne Tailwind en même temps que la refonte.
- **Conséquence** : changement limité, avec possibilité de retirer Tailwind plus tard si aucun composant ne l’utilise durablement.

## 3. Motif visuel d’atelier

- **Décision** : utiliser l’« ordre de travail » : numéros d’intervention, champs lignés, repères de mesure et tampons de statut.
- **Raison** : ce motif traduit une intervention bornée, documentée et vérifiable.
- **Alternative rejetée** : jauges, bandes de danger, faux terminaux et esthétique industrielle théâtrale.
- **Conséquence** : palette bleu encre, acier clair et orange de marquage, avec décoration discrète et fonctionnelle.

## 4. Formulaire statique

- **Décision** : formulaire HTML `POST` vers `PUBLIC_FORM_ENDPOINT`, sans JavaScript obligatoire ; si l’endpoint manque, le formulaire est remplacé par les canaux directs.
- **Raison** : le site doit fonctionner sur un hébergement statique Infomaniak sans fonction Vercel.
- **Alternative rejetée** : conserver Resend ou coder un backend propriétaire.
- **Conséquence** : le prestataire de formulaire devient un sous-traitant à évaluer. Son lieu de traitement ne peut pas être présenté comme suisse sans vérification.

## 5. Réservation

- **Décision** : utiliser `PUBLIC_BOOKING_URL` comme lien normal ; sur `/audit`, l’intégration externe n’est ouverte qu’après action, avec lien direct permanent.
- **Raison** : éviter un script tiers lourd sur l’accueil et préserver un parcours sans JavaScript.
- **Alternative rejetée** : embed Google Calendar eager sur toutes les pages.
- **Conséquence** : en l’absence d’URL, les CTA basculent vers `/contact`.

## 6. Offres et prix

- **Décision** : diagnostic gratuit, cadrage/prototype à partir de CHF 450, mise en œuvre bornée CHF 1’500–4’500, site compact CHF 1’800–3’800, maintenance sur devis. Tous les montants sont centralisés et marqués à valider.
- **Raison** : fournir des repères de qualification sans présenter les anciens prix comme des faits établis.
- **Alternative rejetée** : packs CHF 2’500/4’500/7’500 ou promesses fixes de 48 heures.
- **Conséquence** : le prix ferme suit toujours un cadrage écrit ; le propriétaire doit confirmer les fourchettes avant publication.

## 7. Signaux de confiance

- **Décision** : conserver uniquement l’ancrage à Aclens, la zone de service, la formation à 42 Lausanne, le contact direct, le périmètre écrit, les comptes client et la documentation.
- **Raison** : ces éléments sont visibles ou explicitement fournis dans le mandat.
- **Alternative rejetée** : logos Oust, Socraft, J42L, Marché Cuendet et notion de partenariat/écosystème faute de preuve de relation.
- **Conséquence** : aucun logo tiers, témoignage, note ou résultat client n’est publié.

## 8. Statistiques de marché

- **Décision** : exclure toute statistique de réservation ou de productivité.
- **Raison** : aucune source vérifiable avec date, géographie et population n’existe dans le dépôt.
- **Alternative rejetée** : remplacer les chiffres par une autre statistique trouvée en ligne.
- **Conséquence** : l’argument repose sur des situations concrètes et compréhensibles.

## 9. « Hébergement suisse »

- **Décision** : dire seulement que les fichiers du site sont destinés à Infomaniak ; décrire séparément les processeurs de formulaire, réservation et analytics.
- **Raison** : un hébergeur suisse ne rend pas automatiquement tous les traitements ni sous-traitants suisses.
- **Alternative rejetée** : « toutes vos données restent en Suisse ».
- **Conséquence** : la page de confidentialité reste conditionnelle à la configuration réelle.

## 10. Cas clients brouillons

- **Décision** : collection Astro typée avec champ `draft`; `getStaticPaths`, les listes et les tests filtrent systématiquement `draft: true` en production.
- **Raison** : le modèle fictif ne doit jamais être présenté comme preuve.
- **Alternative rejetée** : publier un cas exemple avec un simple avertissement visuel.
- **Conséquence** : un cas réel exige validation du client, chiffres vérifiables et images expurgées.

## 11. Lighthouse

- **Décision** : auditer un build de production servi localement, en mode mobile, après suppression des scripts et médias lourds.
- **Raison** : les scores doivent être mesurés, pas supposés.
- **Alternative rejetée** : revendiquer les anciens qualificatifs « ultra-performant » sans mesure.
- **Conséquence** : les scores, conditions et limites seront ajoutés après l’audit final.

## 12. Différé

- **Décision** : différer CMS, blog, portail, chatbot, multilingue, moteur de disponibilité et backend personnalisé.
- **Raison** : ces fonctions sont hors périmètre et augmenteraient le coût de maintenance.
- **Alternative rejetée** : les ajouter pour démontrer davantage de technologie.
- **Conséquence** : le site reste une démonstration compacte, statique et maintenable.

## Points à valider par le propriétaire

- authenticité et droit d’utilisation du portrait présent dans le dépôt ;
- téléphone, e-mail et numéro WhatsApp actuellement trouvés dans le dépôt ;
- prix indicatifs et durée/format exacts du diagnostic ;
- identité légale, adresse postale publique et éventuel numéro d’inscription ;
- prestataires effectivement choisis, lieux de traitement et durée de conservation.

`llms.txt` sera fourni comme infrastructure expérimentale de lecture machine. Ce fichier n’est pas un facteur de classement Google établi.
