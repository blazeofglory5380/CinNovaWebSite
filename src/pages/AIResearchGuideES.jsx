// AIResearchGuideES — /guides/ai-research/es   CSS prefix: ait-
// Spanish translation of the AI research guide (multilingual starter pilot).
import "../App.css";
import "./AITutorials.css";
import { siteUrl } from "../data/blogPosts.js";
import { TutorialSEO, Step, Callout, PromptExample, FAQ, ResearchGuideLangNav } from "../components/TutorialKit.jsx";

const FAQ_ITEMS = [
    { q: "¿Puedo citar una herramienta de IA como fuente?", a: "En general, no. El resultado de la IA no es una fuente primaria y puede estar equivocado. Usa la IA para encontrar y entender ideas, y luego cita las fuentes originales y verificables que confirmes tú mismo." },
    { q: "¿Por qué la IA inventó un estudio o un enlace?", a: "Los modelos de lenguaje pueden «alucinar»: producir texto convincente que no es cierto, incluidas citas y URLs falsas. Abre y verifica siempre cualquier fuente antes de confiar en ella." },
    { q: "¿Usar la IA para investigar se considera hacer trampa?", a: "Depende de las normas de tu escuela o trabajo. Usar la IA para explicar conceptos u organizar tus ideas suele estar bien; presentar trabajo escrito por IA como propio quizá no. Consulta la política y sé transparente." },
    { q: "¿En qué es realmente buena la IA para investigar?", a: "Explicar conceptos en lenguaje sencillo, sugerir términos y enfoques de búsqueda, esquematizar y resumir textos que le proporciones. Es más débil con datos, cifras y citas, que debes verificar." },
];

export default function AIResearchGuideES() {
    return (
        <div className="product-page ait-page">
            <TutorialSEO
                title="Guía para usar la IA en la investigación | CinNova"
                description="Aprende a usar la IA para investigar: esquemas, resúmenes, descubrir fuentes y apoyar tus estudios, evitando alucinaciones y verificando los datos con cuidado. Guía paso a paso para principiantes."
                pageKey="ai-research-guide-es"
                siteUrl={siteUrl}
            />

            <section className="section ait-guide-hero">
                <a className="ait-breadcrumb" href="/guides">← Tutoriales de IA</a>
                <p className="eyebrow">IA PARA INVESTIGACIÓN · PRINCIPIANTES</p>
                <h1>Cómo usar la IA para investigar: guía paso a paso para principiantes</h1>
                <p className="ait-guide-intro">
                    La IA puede acelerar la investigación: te ayuda a entender un tema, encontrar enfoques y
                    organizar notas. Pero también puede inventar datos y fuentes falsas. Esta guía muestra
                    cómo ganar velocidad sin correr riesgos.
                </p>
                <div className="ait-meta">
                    <span className="ait-chip">Principiante</span>
                    <span className="ait-chip ait-chip--muted">9 min de lectura</span>
                    <span className="ait-chip ait-chip--muted">Guía atemporal</span>
                </div>
            </section>

            <ResearchGuideLangNav current="es" />

            <p className="section ait-starter-note">
                Esta guía traducida forma parte de la biblioteca multilingüe inicial de CinNova. Pronto
                habrá más tutoriales traducidos.
            </p>

            <section className="section ait-guide-body">
                <h2>Qué significa realmente «ayuda de IA para investigar»</h2>
                <p>
                    Usar la IA para investigar no significa pedirle la respuesta y copiarla. Significa usar la
                    IA como un asistente rápido e incansable que explica ideas, sugiere direcciones y organiza
                    información, mientras tú decides qué es verdad.
                </p>

                <h2>En qué es buena la IA</h2>
                <ul className="ait-list">
                    <li>Explicar conceptos desconocidos en lenguaje sencillo.</li>
                    <li>Sugerir términos de búsqueda, subtemas y enfoques que no habías considerado.</li>
                    <li>Esquematizar un trabajo, informe o plan de estudio.</li>
                    <li>Resumir textos largos que <em>tú</em> le proporciones.</li>
                    <li>Convertir tus notas en bruto en una estructura clara.</li>
                </ul>

                <h2>Para qué no es fiable la IA</h2>
                <Callout tone="warn" title="Trátalos con cautela: verifica siempre">
                    <ul className="ait-list">
                        <li>Datos concretos, fechas, estadísticas y citas.</li>
                        <li>Referencias, nombres de estudios y URLs: a menudo son inventados.</li>
                        <li>Eventos recientes, si la herramienta no se entrenó con datos actuales ni está conectada a ellos.</li>
                        <li>Cualquier cosa de alto riesgo: decisiones médicas, legales, financieras o de seguridad.</li>
                    </ul>
                </Callout>

                <h2>Paso a paso</h2>
                <div className="ait-steps">
                    <Step n={1} title="Define tu pregunta de investigación">
                        <p>Una pregunta enfocada guía todo. Reduce «cambio climático» a algo que se pueda responder.</p>
                        <PromptExample label="Ejemplo">Ayúdame a afinar esto en una sola pregunta de investigación enfocada: «cómo afecta el trabajo remoto a las economías de los pueblos pequeños».</PromptExample>
                    </Step>
                    <Step n={2} title="Pide una explicación de contexto">
                        <p>Oriéntate antes de profundizar. Pide una visión general en lenguaje sencillo y las principales corrientes de pensamiento.</p>
                        <PromptExample label="Ejemplo">Explica los conceptos básicos de [tema] para alguien nuevo en él y enumera los principales puntos de vista o debates.</PromptExample>
                    </Step>
                    <Step n={3} title="Pide los términos clave">
                        <p>Mejor vocabulario significa mejores búsquedas. Pide a la IA los términos, nombres y conceptos que usan los expertos.</p>
                        <PromptExample label="Ejemplo">Enumera 10 términos clave y 5 investigadores u organizaciones reconocidas relacionadas con [tema] para poder buscarlos.</PromptExample>
                    </Step>
                    <Step n={4} title="Pide un esquema de investigación">
                        <p>Convierte el tema en una estructura que puedas rellenar con fuentes verificadas.</p>
                        <PromptExample label="Ejemplo">Crea un esquema para un informe de 5 páginas sobre [pregunta], con secciones y 2-3 subpuntos cada una.</PromptExample>
                    </Step>
                    <Step n={5} title="Pide sugerencias de fuentes (y luego verifica)">
                        <p>Pregunta qué <em>tipos</em> de fuentes buscar y dónde, no citas exactas para creer a ciegas.</p>
                        <PromptExample label="Ejemplo">¿Qué tipos de fuentes (revistas, organismos, conjuntos de datos) serían creíbles para [tema] y qué términos de búsqueda debería usar para encontrarlas?</PromptExample>
                    </Step>
                    <Step n={6} title="Verifica los datos con fuentes de confianza">
                        <p>Este es el paso más importante. Abre tú mismo las fuentes primarias, confirma cada afirmación y descarta lo que no puedas verificar.</p>
                        <Callout tone="bad" title="Nunca hagas esto">
                            <p>No copies una estadística, cita o referencia proporcionada por la IA en tu trabajo sin confirmarla en la fuente original. Si no encuentras la fuente, no uses la afirmación.</p>
                        </Callout>
                    </Step>
                    <Step n={7} title="Convierte las notas en un resumen">
                        <p>Pega tus propias notas verificadas y pide a la IA que las organice, no que añada datos nuevos.</p>
                        <PromptExample label="Ejemplo">Resume las notas de abajo en un párrafo claro. Usa solo lo que te doy; no añadas datos. Notas: [pega].</PromptExample>
                    </Step>
                    <Step n={8} title="Crea las citas a mano y con cuidado">
                        <p>Elabora las citas a partir de las fuentes reales que abriste, con tu guía de estilo. Comprueba a mano autor, título, fecha y enlace: las citas generadas por IA suelen ser incorrectas.</p>
                    </Step>
                </div>

                <h2>Ejemplos de prompts</h2>
                <PromptExample label="Entender">Explícame [concepto] como si fuera nuevo en el campo y luego dame un ejemplo del mundo real.</PromptExample>
                <PromptExample label="Organizar">Aquí están mis notas verificadas. Agrúpalas por temas y señala cualquier cosa que parezca contradictoria: [pega].</PromptExample>

                <h2>Errores que evitar</h2>
                <ul className="ait-list">
                    <li>Tratar las respuestas de la IA como datos en lugar de pistas para verificar.</li>
                    <li>Copiar citas generadas por IA sin abrir las fuentes.</li>
                    <li>Hacer una pregunta amplia en lugar de acotar primero el tema.</li>
                    <li>Dejar que la IA «resuma» material que nunca leíste.</li>
                </ul>

                <h2>Una advertencia sobre las alucinaciones</h2>
                <Callout tone="warn" title="Seguro ≠ correcto">
                    <p>Las herramientas de IA pueden producir texto fluido y con tono autorizado que simplemente es falso, incluyendo estudios, estadísticas y enlaces inventados. La solución es siempre la misma: verifica cada dato y cada fuente en un lugar de confianza y original antes de usarlo.</p>
                </Callout>

                <h2>Privacidad y honestidad académica</h2>
                <Callout tone="warn" title="Recordatorio de privacidad y seguridad">
                    <ul className="ait-list">
                        <li>No pegues datos privados, contraseñas, claves de API ni archivos confidenciales en las herramientas de IA.</li>
                        <li>Las interfaces cambian con frecuencia: revisa siempre la configuración y los términos oficiales más recientes.</li>
                        <li>Revisa cada resultado antes de confiar en él, publicarlo o actuar en consecuencia.</li>
                        <li>Verifica la información importante en una fuente de confianza.</li>
                    </ul>
                </Callout>
                <Callout tone="info" title="Sé honesto sobre el uso de la IA">
                    <p>Sigue la política de tu escuela o trabajo sobre la IA. Usar la IA para entender y organizar suele estar bien; presentar texto escrito por IA como propio puede no estarlo. En caso de duda, indica cómo la usaste.</p>
                </Callout>

                <h2>Preguntas frecuentes</h2>
                <FAQ items={FAQ_ITEMS} />
            </section>

            <section className="section">
                <div className="ait-guide-cta-card">
                    <h2>Sigue aprendiendo IA</h2>
                    <p>Explora más tutoriales de IA para principiantes, paso a paso, en el centro de Tutoriales de IA de CinNova.</p>
                    <div className="ait-guide-cta-actions">
                        <a className="primary-btn" href="/guides">← Volver a Tutoriales de IA</a>
                        <a className="ait-link-btn" href="/guides/ai-research">Read this guide in English</a>
                    </div>
                </div>
            </section>
        </div>
    );
}
