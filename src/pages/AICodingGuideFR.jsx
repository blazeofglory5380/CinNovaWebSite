// AICodingGuideFR — /guides/ai-coding/fr   CSS prefix: ait-
// French translation of the AI coding guide (multilingual starter pilot).
import "../App.css";
import "./AITutorials.css";
import { siteUrl } from "../data/blogPosts.js";
import { TutorialSEO, Step, Callout, PromptExample, FAQ, CodingGuideLangNav } from "../components/TutorialKit.jsx";

const FAQ_ITEMS = [
    { q: "Dois-je savoir coder pour utiliser un assistant de code IA ?", a: "Cela aide beaucoup. L'IA peut écrire du code que vous ne comprenez pas, mais vous devez quand même l'exécuter, le tester et juger s'il est correct et sûr. Commencez petit et demandez à l'IA d'expliquer chaque partie." },
    { q: "L'IA va-t-elle écrire toute mon application ?", a: "Elle peut générer de gros blocs, mais les demandes plus larges risquent davantage de contenir des bugs ou des erreurs subtiles. Travailler une fonction ou un fichier à la fois garde le résultat vérifiable et plus facile à corriger." },
    { q: "Le code généré par l'IA est-il toujours sûr ?", a: "Non. Les assistants peuvent produire du code avec des failles de sécurité ou des pratiques obsolètes. Vérifiez avec un soin particulier tout ce qui touche à l'authentification, aux paiements, aux données des utilisateurs ou au réseau." },
    { q: "Puis-je me fier à l'explication du code par l'IA ?", a: "Souvent utile, mais pas garantie. Si une explication et le code divergent, fiez-vous à ce qui se passe réellement à l'exécution et vérifiez avec la documentation officielle." },
];

export default function AICodingGuideFR() {
    return (
        <div className="product-page ait-page">
            <TutorialSEO
                title="Guide pour utiliser l'IA en programmation | CinNova"
                description="Apprenez à utiliser des assistants de code IA pour planifier des projets, écrire de petites fonctions, déboguer des erreurs, expliquer du code et relire en toute sécurité avant de publier. Guide étape par étape pour débutants."
                pageKey="ai-coding-guide-fr"
                siteUrl={siteUrl}
            />

            <section className="section ait-guide-hero">
                <a className="ait-breadcrumb" href="/guides">← Tutoriels d'IA</a>
                <p className="eyebrow">IA POUR CODER · DÉBUTANT</p>
                <h1>Comment utiliser l'IA pour coder : guide étape par étape pour débutants</h1>
                <p className="ait-guide-intro">
                    Les assistants de code IA peuvent planifier des projets, écrire des fonctions et expliquer
                    des erreurs — transformant des heures de recherche en minutes. Mais ils commettent aussi
                    des erreurs avec assurance. Ce guide présente un flux de travail sûr et vérifiable.
                </p>
                <div className="ait-meta">
                    <span className="ait-chip">Débutant</span>
                    <span className="ait-chip ait-chip--muted">9 min de lecture</span>
                    <span className="ait-chip ait-chip--muted">Guide intemporel</span>
                </div>
            </section>

            <CodingGuideLangNav current="fr" />

            <p className="section ait-starter-note">
                Ce guide traduit fait partie de la bibliothèque multilingue de démarrage de CinNova.
                D'autres tutoriels traduits arrivent bientôt.
            </p>

            <section className="section ait-guide-body">
                <h2>Ce que les assistants de code IA peuvent aider à faire</h2>
                <ul className="ait-list">
                    <li>Expliquer du code, des erreurs et des concepts inconnus.</li>
                    <li>Rédiger de petites fonctions ou des fichiers uniques à partir d'une description.</li>
                    <li>Proposer des corrections quand vous collez un message d'erreur.</li>
                    <li>Refactoriser le code pour le rendre plus clair ou plus sûr.</li>
                    <li>Écrire des tests et des exemples d'utilisation.</li>
                </ul>

                <h2>Ce qu'ils ne peuvent pas garantir</h2>
                <Callout tone="warn" title="Vous restez l'ingénieur">
                    <ul className="ait-list">
                        <li>Que le code soit correct — il peut sembler bon et être quand même faux.</li>
                        <li>Qu'il soit sûr ou à jour avec les bonnes pratiques actuelles.</li>
                        <li>Qu'il corresponde à vos versions, votre environnement ou vos exigences exactes.</li>
                        <li>Qu'il ne casse pas discrètement autre chose dans votre projet.</li>
                    </ul>
                </Callout>

                <h2>Étape par étape</h2>
                <div className="ait-steps">
                    <Step n={1} title="Décrivez votre projet">
                        <p>Donnez à l'assistant la vue d'ensemble : ce que vous construisez, le langage et les outils, et l'objectif. Le contexte en amont évite les suggestions inadaptées.</p>
                        <PromptExample label="Exemple">Je construis une page web simple en HTML, CSS et JavaScript purs qui affiche une liste de tâches enregistrée dans le navigateur. Sans framework.</PromptExample>
                    </Step>
                    <Step n={2} title="Demandez d'abord un plan simple">
                        <p>Avant tout code, obtenez un court plan. Il est plus facile de corriger un plan que de démêler du mauvais code.</p>
                        <PromptExample label="Exemple">Donne-moi un plan numéroté et simple pour construire cela. N'écris pas encore de code.</PromptExample>
                    </Step>
                    <Step n={3} title="Demandez un fichier ou une fonction à la fois">
                        <p>Les demandes petites et ciblées produisent du code que vous pouvez vraiment lire et tester. Construisez pièce par pièce.</p>
                        <PromptExample label="Exemple">Écris seulement la fonction qui enregistre une tâche dans le stockage local. Garde-la petite et ajoute des commentaires.</PromptExample>
                    </Step>
                    <Step n={4} title="Demandez à l'IA d'expliquer le code">
                        <p>Ne collez jamais du code que vous ne comprenez pas. Demandez une explication ligne par ligne et ce qui pourrait mal tourner.</p>
                        <PromptExample label="Exemple">Explique cette fonction ligne par ligne et liste les cas limites qu'elle ne gère pas.</PromptExample>
                    </Step>
                    <Step n={5} title="Exécutez le code en local">
                        <p>Exécutez-le réellement dans votre propre environnement. Le vrai test, c'est le comportement, pas la description de l'IA. Essayez des entrées normales et inhabituelles.</p>
                    </Step>
                    <Step n={6} title="Renvoyez les erreurs à l'IA">
                        <p>Quand quelque chose casse, collez le message d'erreur complet et le code concerné. Des erreurs précises reçoivent des corrections précises.</p>
                        <PromptExample label="Exemple">J'ai eu cette erreur en exécutant le code : [colle l'erreur complète]. Voici la fonction : [colle]. Qu'est-ce qui ne va pas et comment corriger ?</PromptExample>
                    </Step>
                    <Step n={7} title="Demandez du code plus sûr ou refactorisé">
                        <p>Une fois que ça marche, demandez à l'assistant de l'améliorer : noms plus clairs, gestion des erreurs et pratiques plus sûres.</p>
                        <PromptExample label="Exemple">Refactorise ceci pour la lisibilité, ajoute une gestion d'erreurs de base et signale tout problème de sécurité.</PromptExample>
                    </Step>
                    <Step n={8} title="Relisez avant de publier">
                        <p>Vous êtes responsable de ce que vous publiez. Lisez chaque changement, exécutez vos tests et assurez-vous de le comprendre avant de valider.</p>
                        <Callout tone="info" title="Checklist de relecture rapide">
                            <ul className="ait-list">
                                <li>Est-ce que je comprends ce que fait ce code ?</li>
                                <li>L'ai-je exécuté et testé sur les cas limites ?</li>
                                <li>Gère-t-il en toute sécurité les secrets, les données des utilisateurs ou le réseau ?</li>
                                <li>Casse-t-il autre chose ?</li>
                            </ul>
                        </Callout>
                    </Step>
                </div>

                <h2>Exemples de prompts de code</h2>
                <PromptExample label="Construire">Écris une petite fonction JavaScript bien commentée qui valide une adresse e-mail. Garde-la simple et explique l'approche.</PromptExample>
                <PromptExample label="Comprendre">Que fait cette expression régulière et où pourrait-elle échouer ? [colle]</PromptExample>

                <h2>Exemples de prompts de débogage</h2>
                <PromptExample label="Déboguer">Cette fonction devrait renvoyer des nombres triés mais les renvoie sous forme de chaînes. Voici le code et un exemple d'entrée/sortie : [colle]. Pourquoi, et comment corriger ?</PromptExample>
                <PromptExample label="Déboguer">Ma page se charge mais le bouton ne fait rien. Voici le HTML et le JS : [colle]. Guide-moi sur ce qu'il faut vérifier en premier.</PromptExample>

                <h2>Erreurs de débutant à éviter</h2>
                <ul className="ait-list">
                    <li>Coller de grandes quantités de code de l'IA sans le lire ni l'exécuter.</li>
                    <li>Demander une application entière en un seul prompt au lieu de petites pièces.</li>
                    <li>Supposer que le code est sûr ou correspond aux versions de vos bibliothèques.</li>
                    <li>Sauter les tests locaux parce que « ça a l'air bon ».</li>
                    <li>Valider des changements que vous ne comprenez pas.</li>
                </ul>

                <h2>Note de sécurité</h2>
                <Callout tone="bad" title="Ne collez jamais de secrets">
                    <p>Ne collez pas de clés d'API, de mots de passe, de jetons, de clés privées, de données clients ni de code propriétaire dans un outil d'IA. Remplacez les secrets par des espaces réservés comme <code>YOUR_API_KEY</code> avant de partager du code, et renouvelez tout secret que vous auriez pu exposer.</p>
                </Callout>
                <Callout tone="warn" title="Rappel de confidentialité et de sécurité">
                    <ul className="ait-list">
                        <li>Ne collez pas de données privées, de mots de passe, de clés d'API ni de fichiers confidentiels dans les outils d'IA.</li>
                        <li>Les interfaces changent souvent : vérifiez toujours les paramètres et conditions officiels les plus récents.</li>
                        <li>Relisez chaque résultat avant de lui faire confiance, de le publier ou d'agir en conséquence.</li>
                        <li>Vérifiez les informations importantes auprès d'une source fiable.</li>
                    </ul>
                </Callout>

                <h2>Foire aux questions</h2>
                <FAQ items={FAQ_ITEMS} />
            </section>

            <section className="section">
                <div className="ait-guide-cta-card">
                    <h2>Continuez à apprendre l'IA</h2>
                    <p>Explorez d'autres tutoriels d'IA pour débutants, étape par étape, sur le centre de Tutoriels d'IA de CinNova.</p>
                    <div className="ait-guide-cta-actions">
                        <a className="primary-btn" href="/guides">← Retour aux Tutoriels d'IA</a>
                        <a className="ait-link-btn" href="/guides/ai-coding">Read this guide in English</a>
                    </div>
                </div>
            </section>
        </div>
    );
}
