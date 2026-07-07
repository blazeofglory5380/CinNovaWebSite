// AIPromptGuideFR — /?page=ai-prompt-writing-guide-fr   CSS prefix: ait-
// French translation of the AI prompt writing guide (multilingual starter pilot).
import "../App.css";
import "./AITutorials.css";
import { siteUrl } from "../data/blogPosts.js";
import { TutorialSEO, Step, Callout, PromptExample, FAQ, PromptGuideLangNav } from "../components/TutorialKit.jsx";

const FAQ_ITEMS = [
    { q: "Ai-je besoin d'un outil d'IA payant pour m'entraîner ?", a: "Non. Les mêmes compétences de rédaction de prompts fonctionnent sur la plupart des assistants. Commencez avec n'importe quel outil auquel vous avez déjà accès et concentrez-vous sur des instructions plus claires." },
    { q: "Quelle doit être la longueur d'un prompt ?", a: "Aussi long que nécessaire pour lever toute ambiguïté, et pas plus. Quelques phrases claires indiquant le rôle, la tâche, le contexte et le format valent mieux qu'un prompt d'un seul mot ou qu'un mur de texte." },
    { q: "Pourquoi l'IA a-t-elle ignoré une partie de mon prompt ?", a: "Les prompts longs ou contradictoires peuvent amener le modèle à oublier des détails. Découpez les grandes demandes en étapes, placez l'instruction la plus importante en premier et demandez-lui de vous confirmer les exigences." },
    { q: "Est-il acceptable de réutiliser le même prompt ?", a: "Oui : les modèles de prompts réutilisables font gagner beaucoup de temps. Gardez une bibliothèque personnelle et changez les détails à chaque fois." },
];

export default function AIPromptGuideFR() {
    return (
        <div className="product-page ait-page">
            <TutorialSEO
                title="Guide pour écrire de meilleurs prompts IA | CinNova"
                description="Apprenez à écrire de meilleurs prompts IA avec un guide étape par étape pour débutants. Inclut des exemples, des erreurs à éviter, des conseils de confidentialité et une formule simple."
                pageKey="ai-prompt-writing-guide-fr"
                siteUrl={siteUrl}
            />

            <section className="section ait-guide-hero">
                <a className="ait-breadcrumb" href="/?page=ai-tutorials">← Tutoriels d'IA</a>
                <p className="eyebrow">RÉDACTION DE PROMPTS · DÉBUTANT</p>
                <h1>Comment écrire de meilleurs prompts IA : guide étape par étape pour débutants</h1>
                <p className="ait-guide-intro">
                    Un prompt n'est rien d'autre que l'instruction que vous donnez à un outil d'IA. De petits
                    changements dans votre façon de demander peuvent transformer une réponse vague et inutile
                    en exactement ce dont vous aviez besoin. Ce guide enseigne une formule simple et
                    reproductible, avec de vrais exemples avant/après.
                </p>
                <div className="ait-meta">
                    <span className="ait-chip">Débutant</span>
                    <span className="ait-chip ait-chip--muted">8 min de lecture</span>
                    <span className="ait-chip ait-chip--muted">Guide intemporel</span>
                </div>
            </section>

            <PromptGuideLangNav current="fr" />

            <p className="section ait-starter-note">
                Ce guide traduit fait partie de la bibliothèque multilingue de démarrage de CinNova.
                D'autres tutoriels traduits arrivent bientôt.
            </p>

            <section className="section ait-guide-body">
                <h2>Qu'est-ce qu'un prompt IA ?</h2>
                <p>
                    Un prompt IA est le texte que vous saisissez pour indiquer à un outil d'IA ce que vous
                    voulez. Cela peut être une question, une tâche ou un ensemble d'instructions. L'IA lit
                    votre prompt et prédit une réponse utile : plus votre prompt est clair et précis, meilleur
                    est le résultat.
                </p>

                <h2>Pourquoi les prompts sont importants</h2>
                <p>
                    Les outils d'IA ne connaissent ni votre objectif, ni votre public, ni vos exigences, sauf
                    si vous les leur indiquez. Un prompt faible oblige l'IA à deviner, et elle se trompe
                    souvent. Un bon prompt supprime les suppositions : il précise quel rôle l'IA doit jouer,
                    quoi faire, quel contexte utiliser, comment présenter la réponse et quelles limites
                    respecter.
                </p>

                <h2>La formule de base d'un prompt</h2>
                <div className="ait-formula">
                    <b>Rôle</b> + <b>Tâche</b> + <b>Contexte</b> + <b>Format</b> + <b>Contraintes</b>
                </div>
                <p>
                    Vous n'aurez pas toujours besoin des cinq, mais les garder à l'esprit est le moyen le plus
                    rapide d'écrire un prompt qui fonctionne du premier coup. Voici comment appliquer chacune.
                </p>

                <h2>Étape par étape</h2>
                <div className="ait-steps">
                    <Step n={1} title="Indiquez le rôle que l'IA doit jouer">
                        <p>Donnez une perspective à l'IA pour qu'elle adopte le bon ton et la bonne expertise. « Agis comme un professeur de maths patient » produit un résultat très différent de « agis comme un relecteur critique ».</p>
                        <PromptExample label="Exemple">Agis comme un conseiller d'orientation bienveillant qui explique les choses simplement.</PromptExample>
                    </Step>
                    <Step n={2} title="Expliquez clairement la tâche">
                        <p>Indiquez exactement ce que vous voulez, avec un verbe d'action clair : résume, réécris, compare, structure, génère, critique. Évitez les verbes vagues comme « aide-moi avec ».</p>
                        <PromptExample label="Exemple">Réécris le résumé de mon CV pour mettre en avant le leadership et des résultats mesurables.</PromptExample>
                    </Step>
                    <Step n={3} title="Ajoutez du contexte">
                        <p>Donnez les détails que l'IA ne peut pas connaître : votre public, votre objectif, les faits pertinents et tout élément à utiliser. Le contexte fait souvent la différence entre une réponse générique et une réponse utile.</p>
                        <PromptExample label="Exemple">Contexte : je suis infirmier avec 6 ans d'expérience et je postule à un poste d'infirmier en chef. Voici mon résumé actuel : [collez votre propre texte].</PromptExample>
                    </Step>
                    <Step n={4} title="Choisissez le format de sortie">
                        <p>Indiquez à l'IA comment vous voulez la réponse : une liste à puces, un tableau, un court paragraphe, du JSON, un e-mail ou un plan étape par étape. Préciser le format dès le départ évite de tout refaire.</p>
                        <PromptExample label="Exemple">Donne-moi trois versions sous forme de courts paragraphes, chacun de moins de 60 mots.</PromptExample>
                    </Step>
                    <Step n={5} title="Ajoutez des contraintes">
                        <p>Fixez des limites : longueur, ton, niveau de lecture, ce qu'il faut éviter et ce qu'il faut inclure. Les contraintes gardent la réponse ciblée.</p>
                        <PromptExample label="Exemple">Reste professionnel, évite le jargon à la mode et n'invente pas de titres de poste ni de dates que je n'ai pas fournis.</PromptExample>
                    </Step>
                    <Step n={6} title="Demandez des révisions">
                        <p>La première réponse est un brouillon. Améliorez-la avec des relances ciblées plutôt que de tout recommencer. Pointez la partie précise que vous voulez changer.</p>
                        <PromptExample label="Exemple">La version 2 est la plus proche. Raccourcis-la de 20 % et commence par le meilleur résultat.</PromptExample>
                    </Step>
                    <Step n={7} title="Enregistrez des prompts réutilisables">
                        <p>Quand un prompt fonctionne bien, enregistrez-le comme modèle avec des espaces réservés. La prochaine fois, remplacez les détails et réutilisez la structure.</p>
                        <PromptExample label="Modèle">Agis comme [rôle]. [Tâche] pour [public]. Contexte : [détails]. Format : [format]. Contraintes : [limites].</PromptExample>
                    </Step>
                </div>

                <h2>Exemple de bon prompt</h2>
                <Callout tone="good" title="Clair, précis et structuré">
                    <PromptExample>Agis comme un relecteur-correcteur. Réécris le paragraphe ci-dessous pour un public général, à un niveau de lecture simple. Reste sous 120 mots, ne change aucun fait et renvoie uniquement le paragraphe corrigé. Paragraphe : [collez le texte].</PromptExample>
                </Callout>

                <h2>Exemple de mauvais prompt</h2>
                <Callout tone="bad" title="Vague : l'IA doit deviner">
                    <PromptExample>améliore ça</PromptExample>
                    <p>Pas de rôle, pas de public, pas de format, pas de longueur et aucun texte joint. Attendez-vous à une réponse générique.</p>
                </Callout>

                <h2>Avant / après</h2>
                <Callout tone="bad" title="Avant">
                    <PromptExample>écris sur le changement climatique</PromptExample>
                </Callout>
                <Callout tone="good" title="Après">
                    <PromptExample>Agis comme un vulgarisateur scientifique. Rédige une explication de 150 mots sur pourquoi les villes semblent plus chaudes que les zones rurales voisines, pour des adolescents curieux. Utilise une analogie du quotidien, évite le jargon et termine par un conseil pratique.</PromptExample>
                </Callout>

                <h2>Erreurs fréquentes des débutants</h2>
                <ul className="ait-list">
                    <li>Être trop vague : pas de rôle, de public ni de format.</li>
                    <li>Tout demander dans un seul prompt géant au lieu de procéder par étapes.</li>
                    <li>Ne pas fournir le texte ou les données dont l'IA a besoin.</li>
                    <li>Accepter la première réponse sans demander de révision.</li>
                    <li>Faire confiance au résultat sans vérifier les faits.</li>
                </ul>

                <h2>Confidentialité et sécurité</h2>
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
                        <a className="primary-btn" href="/?page=ai-tutorials">← Retour aux Tutoriels d'IA</a>
                        <a className="ait-link-btn" href="/?page=ai-prompt-writing-guide">Read this guide in English</a>
                    </div>
                </div>
            </section>
        </div>
    );
}
