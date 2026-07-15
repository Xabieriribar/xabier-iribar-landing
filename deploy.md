# Déploiement statique sur Infomaniak

Cette procédure publie des fichiers ordinaires. Aucun serveur Node, adaptateur Astro, endpoint Vercel ou service Resend n’est requis en production.

## 1. Prérequis de build

- Node.js 22 LTS, version 22.12.0 au minimum ;
- npm 9.6.5 ou plus récent ;
- accès au Manager Infomaniak et au répertoire web du domaine ;
- accès SFTP/FTP ou gestionnaire de fichiers Infomaniak.

Le poste qui compile peut utiliser une version Node plus récente supportée, mais Node 22 LTS est la référence reproductible.

## 2. Variables d’environnement

Copier `.env.example` vers `.env` sur la machine de build et compléter uniquement les valeurs publiques nécessaires. Ne pas envoyer `.env` dans le répertoire web et ne pas le committer.

Les variables `PUBLIC_*` sont intégrées aux fichiers générés. Elles ne sont pas des secrets. Le site ne nécessite aucune clé privée.

Avant d’activer le formulaire :

1. choisir un endpoint HTTPS qui accepte un `POST` HTML ;
2. vérifier contrat, sous-traitants, pays de traitement, rétention et anti-spam ;
3. adapter le nom du champ de redirection (`success_url`) si le prestataire utilise une autre convention ;
4. ajouter son origine exacte à `form-action` dans `public/.htaccess` ;
5. reconstruire et tester.

Faire la même revue pour le service de réservation et limiter `frame-src` à son domaine. Si Plausible est activé, renseigner le domaine réellement suivi.

## 3. Installation et build

Depuis la racine du dépôt :

```bash
npm ci && npm run build
```

Sortie :

```text
dist/
```

Contrôles recommandés avant upload :

```bash
npm run format:check
npm run check
npm test
npm audit --omit=dev
```

`npm test` reconstruit lui-même le site. Pour reproduire l’audit mobile local :

```bash
npm run build
npm run audit:lighthouse
```

## 4. Upload

Dans le Manager Infomaniak, associer `xabieriribar.ch` au dossier web prévu. Le nom exact du dossier dépend du contrat (souvent un sous-dossier de `web/`) : le vérifier dans **Hébergement Web → Sites** plutôt que de le supposer.

Téléverser **le contenu de `dist/`**, y compris le fichier caché `.htaccess`, à la racine du dossier associé au domaine. Ne pas téléverser le dossier `dist` comme niveau supplémentaire.

Méthodes possibles :

- gestionnaire de fichiers du Manager pour une publication manuelle ;
- SFTP/FTP avec un client graphique ;
- `rsync` via SSH uniquement si cette fonction est activée sur l’hébergement.

Exemple SFTP conceptuel, à adapter aux identifiants fournis par Infomaniak :

```text
local:  dist/* et dist/.htaccess
remote: dossier racine configuré pour xabieriribar.ch
```

Supprimer les anciens fichiers qui n’existent plus dans `dist/` afin de ne pas laisser d’anciens scripts, pages Vercel ou médias accessibles.

## 5. Routage

Astro génère un dossier `index.html` par route (`offres/index.html`, `audit/index.html`, etc.). Apache doit autoriser les index de répertoire, ce qui est le comportement attendu d’un hébergement web Infomaniak.

`public/.htaccess` devient `dist/.htaccess` et fournit :

- la redirection permanente de l’ancienne URL `/diagnostic` vers `/audit/` ;
- la désactivation de l’indexation des dossiers ;
- des en-têtes de sécurité ;
- une politique de cache ;
- la compression lorsque les modules Apache correspondants sont actifs.

Si le site renvoie une erreur 500 après upload, renommer temporairement `.htaccess`, identifier la directive non supportée avec les journaux Infomaniak, puis adapter la configuration. Ne pas supposer que les anciens en-têtes Vercel s’appliquent.

La CSP fournie est volontairement configurable (`form-action https:` et `frame-src https:`). Après choix des prestataires, remplacer ces valeurs larges par leurs origines HTTPS exactes et retester formulaire, calendrier, Plausible et données structurées.

## 6. Domaine et HTTPS

Dans le Manager :

1. vérifier que `xabieriribar.ch` et, si utilisé, `www.xabieriribar.ch` pointent vers le bon site ;
2. activer/renouveler le certificat TLS ;
3. choisir un domaine canonique et rediriger l’autre variante ;
4. forcer HTTPS avec l’option Infomaniak prévue ou une règle testée ;
5. vérifier qu’il n’existe aucun contenu mixte ;
6. n’activer HSTS que lorsque HTTPS fonctionne durablement sur tous les sous-domaines concernés.

L’exemple `.htaccess` contient HSTS avec `includeSubDomains`. Le retirer avant le premier déploiement si tous les sous-domaines ne sont pas prêts.

## 7. Vérifications après déploiement

Ouvrir les pages suivantes sur mobile et ordinateur :

- `/`, `/offres/`, `/audit/`, `/methode/`, `/a-propos/`, `/contact/` ;
- `/mentions-legales/` et `/confidentialite/` ;
- `/merci/` (doit contenir `noindex`) ;
- `/robots.txt`, `/sitemap-index.xml` et `/llms.txt`.

Puis vérifier :

1. chaque lien de navigation et retour ;
2. le téléphone et WhatsApp sur un vrai téléphone ;
3. le POST réel du formulaire sans JavaScript et la redirection vers `/merci/` ;
4. le comportement en erreur du processeur ;
5. le lien direct et le chargement volontaire de la réservation ;
6. l’absence de cas brouillon dans le sitemap ;
7. l’absence de requête Plausible si la variable est vide ;
8. les en-têtes avec les outils développeur ou `curl -I https://xabieriribar.ch/` ;
9. la CSP et la console sans erreur ;
10. le certificat, les redirections `www`/non-`www` et le canonical ;
11. les JSON-LD avec un validateur de données structurées ;
12. Lighthouse mobile depuis l’URL publique.

## Commande et dossier exacts

```bash
npm ci && npm run build
```

Dossier à publier : `dist/` (son contenu, pas le dossier parent).
