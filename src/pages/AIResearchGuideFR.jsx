// AIResearchGuideFR — /guides/ai-research/fr   CSS prefix: ait-
// French translation of the AI research guide (multilingual starter pilot).
import "../App.css";
import "./AITutorials.css";
import { siteUrl } from "../data/blogPosts.js";
import { TutorialSEO, Step, Callout, PromptExample, FAQ, ResearchGuideLangNav } from "../components/TutorialKit.jsx";

const FAQ_ITEMS = [
    { q: "Puis-je citer un outil d'IA comme source ?", a: "En général, non. Le résultat de l'IA n'est pas une source primaire et peut être faux. Utilisez l'IA pour trouver et comprendre des idées, puis citez les sources originales et vérifiables que vous confirmez vous-même." },
    { q: "Pourquoi l'IA a-t-elle inventé une étude ou un lien ?", a: "Les modèles de langage peuvent « halluciner » : produire un texte convaincant qui est faux, y compris des citations et des URL fictives. Ouvrez et vérifiez toujours une source avant de vous y fier." },
    { q: "Utiliser l'IA pour la recherche est-il de la triche ?", a: "Cela dépend des règles de votre école ou de votre travail. Utiliser l'IA pour expliquer des concepts ou organiser vos idées est souvent acceptable ; présenter un texte écrit par l'IA comme le vôtre peut ne pas l'être. Vérifiez la politique et soyez transparent." },
    { q: "En quoi l'IA est-elle vraiment bonne pour la recherche ?", a: "Expliquer des concepts en langage simple, suggérer des termes et des angles de recherche, structurer un plan et résumer des textes que vous fournissez. Elle est plus faible sur les faits, les chiffres et les citations, que vous devez vérifier." },
];

export default function AIResearchGuideFR() {
    return (
        <div className="product-page ait-page">
            <TutorialSEO
                title="Guide pour utiliser l'IA dans la recherche | CinNova"
                description="Apprenez à utiliser l'IA pour la recherche : plans, résumés, découverte de sources et soutien aux études, en évitant les hallucinations et en vérifiant les faits. Guide étape par étape pour débutants."
                pageKey="ai-research-guide-fr"
                siteUrl={siteUrl}
            />

            <section className="section ait-guide-hero">
                <a className="ait-breadcrumb" href="/guides">← Tutoriels d'IA</a>
                <p className="eyebrow">IA POUR LA RECHERCHE · DÉBUTANT</p>
                <h1>Comment utiliser l'IA pour la recherche : guide étape par étape pour débutants</h1>
                <p className="ait-guide-intro">
                    L'IA peut accélérer la recherche : elle vous aide à comprendre un sujet, à trouver des
                    angles et à organiser vos notes. Mais elle peut aussi inventer des faits et de fausses
                    sources. Ce guide montre comment gagner en rapidité sans prendre de risques.
                </p>
                <div className="ait-meta">
                    <span className="ait-chip">Débutant</span>
                    <span className="ait-chip ait-chip--muted">9 min de lecture</span>
                    <span className="ait-chip ait-chip--muted">Guide intemporel</span>
                </div>
            </section>

            <ResearchGuideLangNav current="fr" />

            <p className="section ait-starter-note">
                Ce guide traduit fait partie de la bibliothèque multilingue de démarrage de CinNova.
                D'autres tutoriels traduits arrivent bientôt.
            </p>

            <section className="section ait-guide-body">
                <h2>Ce que « l'aide de l'IA à la recherche » signifie vraiment</h2>
                <p>
                    Utiliser l'IA pour la recherche ne signifie pas lui demander la réponse et la recopier.
                    Cela signifie utiliser l'IA comme un assistant rapide et infatigable qui explique des
                    idées, suggère des directions et organise l'information, pendant que vous restez juge de
                    ce qui est vrai.
                </p>

                <h2>Ce que l'IA fait bien</h2>
                <ul className="ait-list">
                    <li>Expliquer des concepts inconnus en langage simple.</li>
                    <li>Suggérer des termes de recherche, des sous-thèmes et des angles auxquels vous n'aviez pas pensé.</li>
                    <li>Structurer un devoir, un rapport ou un plan d'étude.</li>
                    <li>Résumer un long texte que <em>vous</em> fournissez.</li>
                    <li>Transformer vos notes brutes en une structure claire.</li>
                </ul>

                <h2>Ce pour quoi l'IA n'est pas fiable</h2>
                <Callout tone="warn" title="À traiter avec prudence — vérifiez toujours">
                    <ul className="ait-list">
                        <li>Les faits précis, les dates, les statistiques et les citations.</li>
                        <li>Les références, les noms d'études et les URL — souvent inventés.</li>
                        <li>Les événements récents, si l'outil n'a pas été entraîné sur des données actuelles ni connecté à celles-ci.</li>
                        <li>Tout ce qui est à enjeu élevé : décisions médicales, juridiques, financières ou de sécurité.</li>
                    </ul>
                </Callout>

                <h2>Étape par étape</h2>
                <div className="ait-steps">
                    <Step n={1} title="Définissez votre question de recherche">
                        <p>Une question ciblée guide tout. Réduisez « le changement climatique » à quelque chose auquel on peut répondre.</p>
                        <PromptExample label="Exemple">Aide-moi à préciser cela en une seule question de recherche ciblée : « comment le télétravail affecte l'économie des petites villes ».</PromptExample>
                    </Step>
                    <Step n={2} title="Demandez une explication de contexte">
                        <p>Orientez-vous avant de plonger. Demandez un aperçu en langage simple et les principaux courants de pensée.</p>
                        <PromptExample label="Exemple">Explique les bases de [sujet] pour un débutant et énumère les principaux points de vue ou débats.</PromptExample>
                    </Step>
                    <Step n={3} title="Demandez les termes clés">
                        <p>Un meilleur vocabulaire permet de mieux chercher. Faites lister par l'IA les termes, noms et concepts qu'utilisent les experts.</p>
                        <PromptExample label="Exemple">Énumère 10 termes clés et 5 chercheurs ou organisations reconnus liés à [sujet] pour que je puisse les rechercher.</PromptExample>
                    </Step>
                    <Step n={4} title="Demandez un plan de recherche">
                        <p>Transformez le sujet en une structure que vous remplirez avec des sources vérifiées.</p>
                        <PromptExample label="Exemple">Crée un plan pour un rapport de 5 pages sur [question], avec des sections et 2 à 3 sous-points chacune.</PromptExample>
                    </Step>
                    <Step n={5} title="Demandez des suggestions de sources (puis vérifiez)">
                        <p>Demandez quels <em>types</em> de sources chercher et où — pas des citations exactes à croire aveuglément.</p>
                        <PromptExample label="Exemple">Quels types de sources (revues, agences, jeux de données) seraient crédibles pour [sujet], et quels termes de recherche devrais-je utiliser pour les trouver ?</PromptExample>
                    </Step>
                    <Step n={6} title="Vérifiez les faits auprès de sources fiables">
                        <p>C'est l'étape la plus importante. Ouvrez vous-même les sources primaires, confirmez chaque affirmation et écartez ce que vous ne pouvez pas vérifier.</p>
                        <Callout tone="bad" title="Ne faites jamais ceci">
                            <p>Ne copiez pas dans votre travail une statistique, une citation ou une référence fournie par l'IA sans la confirmer dans la source originale. Si vous ne trouvez pas la source, n'utilisez pas l'affirmation.</p>
                        </Callout>
                    </Step>
                    <Step n={7} title="Transformez vos notes en résumé">
                        <p>Collez vos propres notes vérifiées et demandez à l'IA de les organiser — pas d'ajouter de nouveaux faits.</p>
                        <PromptExample label="Exemple">Résume les notes ci-dessous en un paragraphe clair. Utilise uniquement ce que je fournis ; n'ajoute pas de faits. Notes : [colle].</PromptExample>
                    </Step>
                    <Step n={8} title="Créez les citations à la main et avec soin">
                        <p>Construisez les citations à partir des sources réelles que vous avez ouvertes, selon votre guide de style. Vérifiez à la main l'auteur, le titre, la date et le lien : les citations générées par l'IA sont souvent erronées.</p>
                    </Step>
                </div>

                <h2>Exemples de prompts</h2>
                <PromptExample label="Comprendre">Explique-moi [concept] comme si je débutais dans le domaine, puis donne un exemple concret.</PromptExample>
                <PromptExample label="Organiser">Voici mes notes vérifiées. Regroupe-les par thèmes et signale tout ce qui semble contradictoire : [colle].</PromptExample>

                <h2>Erreurs à éviter</h2>
                <ul className="ait-list">
                    <li>Prendre les réponses de l'IA pour des faits au lieu de pistes à vérifier.</li>
                    <li>Copier des citations générées par l'IA sans ouvrir les sources.</li>
                    <li>Poser une question large au lieu de d'abord cibler le sujet.</li>
                    <li>Laisser l'IA « résumer » un contenu que vous n'avez jamais lu.</li>
                </ul>

                <h2>Un avertissement sur les hallucinations</h2>
                <Callout tone="warn" title="Assuré ≠ correct">
                    <p>Les outils d'IA peuvent produire un texte fluide et au ton assuré qui est tout simplement faux, y compris des études, des statistiques et des liens fabriqués. La solution est toujours la même : vérifiez chaque fait et chaque source dans un lieu fiable et original avant de l'utiliser.</p>
                </Callout>

                <h2>Confidentialité et honnêteté académique</h2>
                <Callout tone="warn" title="Rappel de confidentialité et de sécurité">
                    <ul className="ait-list">
                        <li>Ne collez pas de données privées, de mots de passe, de clés d'API ni de fichiers confidentiels dans les outils d'IA.</li>
                        <li>Les interfaces changent souvent : vérifiez toujours les paramètres et conditions officiels les plus récents.</li>
                        <li>Relisez chaque résultat avant de lui faire confiance, de le publier ou d'agir en conséquence.</li>
                        <li>Vérifiez les informations importantes auprès d'une source fiable.</li>
                    </ul>
                </Callout>
                <Callout tone="info" title="Soyez honnête sur votre usage de l'IA">
                    <p>Suivez la politique de votre école ou de votre travail concernant l'IA. Utiliser l'IA pour comprendre et organiser est généralement acceptable ; présenter un texte écrit par l'IA comme le vôtre peut ne pas l'être. En cas de doute, indiquez comment vous l'avez utilisée.</p>
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
                        <a className="ait-link-btn" href="/guides/ai-research">Read this guide in English</a>
                    </div>
                </div>
            </section>
        </div>
    );
}
