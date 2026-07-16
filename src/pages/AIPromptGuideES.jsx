// AIPromptGuideES — /guides/ai-prompt-writing/es   CSS prefix: ait-
// Spanish translation of the AI prompt writing guide (multilingual starter pilot).
import "../App.css";
import "./AITutorials.css";
import { siteUrl } from "../data/blogPosts.js";
import { TutorialSEO, Step, Callout, PromptExample, FAQ, PromptGuideLangNav } from "../components/TutorialKit.jsx";

const FAQ_ITEMS = [
    { q: "¿Necesito una herramienta de IA de pago para practicar?", a: "No. Las mismas habilidades de escritura de prompts funcionan en la mayoría de los asistentes. Empieza con cualquier herramienta a la que ya tengas acceso y concéntrate en escribir instrucciones más claras." },
    { q: "¿Cuánto debe medir un prompt?", a: "Lo necesario para eliminar la ambigüedad, y no más. Unas pocas frases claras que indiquen el rol, la tarea, el contexto y el formato suelen ser mejores que un prompt de una sola palabra o un muro de texto enorme." },
    { q: "¿Por qué la IA ignoró parte de mi prompt?", a: "Los prompts largos o contradictorios pueden hacer que el modelo pase por alto detalles. Divide las peticiones grandes en pasos, pon la instrucción más importante al principio y pídele que te confirme los requisitos." },
    { q: "¿Está bien reutilizar el mismo prompt?", a: "Sí: las plantillas de prompts reutilizables ahorran mucho tiempo. Mantén una biblioteca personal y cambia los detalles cada vez." },
];

export default function AIPromptGuideES() {
    return (
        <div className="product-page ait-page">
            <TutorialSEO
                title="Guía para escribir mejores prompts de IA | CinNova"
                description="Aprende a escribir mejores prompts de IA con una guía paso a paso para principiantes. Incluye ejemplos, errores comunes, consejos de privacidad y una fórmula sencilla para mejorar tus resultados."
                pageKey="ai-prompt-writing-guide-es"
                siteUrl={siteUrl}
            />

            <section className="section ait-guide-hero">
                <a className="ait-breadcrumb" href="/guides">← Tutoriales de IA</a>
                <p className="eyebrow">ESCRIBIR PROMPTS · PRINCIPIANTES</p>
                <h1>Cómo escribir mejores prompts de IA: guía paso a paso para principiantes</h1>
                <p className="ait-guide-intro">
                    Un prompt es simplemente la instrucción que le das a una herramienta de IA. Pequeños
                    cambios en la forma de preguntar pueden convertir una respuesta vaga e inútil en
                    exactamente lo que necesitabas. Esta guía enseña una fórmula sencilla y repetible con
                    ejemplos reales de antes y después.
                </p>
                <div className="ait-meta">
                    <span className="ait-chip">Principiante</span>
                    <span className="ait-chip ait-chip--muted">8 min de lectura</span>
                    <span className="ait-chip ait-chip--muted">Guía atemporal</span>
                </div>
            </section>

            <PromptGuideLangNav current="es" />

            <p className="section ait-starter-note">
                Esta guía traducida forma parte de la biblioteca multilingüe inicial de CinNova. Pronto
                habrá más tutoriales traducidos.
            </p>

            <section className="section ait-guide-body">
                <h2>¿Qué es un prompt de IA?</h2>
                <p>
                    Un prompt de IA es el texto que escribes para indicarle a una herramienta de IA lo que
                    quieres. Puede ser una pregunta, una tarea o un conjunto de instrucciones. La IA lee tu
                    prompt y predice una respuesta útil, así que cuanto más claro y específico sea tu prompt,
                    mejor será el resultado.
                </p>

                <h2>Por qué importan los prompts</h2>
                <p>
                    Las herramientas de IA no conocen tu objetivo, tu público ni tus criterios a menos que se
                    los indiques. Un prompt débil obliga a la IA a adivinar, y a menudo se equivoca. Un buen
                    prompt elimina las conjeturas: indica qué papel debe adoptar la IA, qué debe hacer, qué
                    contexto usar, cómo dar formato a la respuesta y qué límites respetar.
                </p>

                <h2>La fórmula básica del prompt</h2>
                <div className="ait-formula">
                    <b>Rol</b> + <b>Tarea</b> + <b>Contexto</b> + <b>Formato</b> + <b>Restricciones</b>
                </div>
                <p>
                    No siempre necesitarás las cinco, pero tenerlas en cuenta es la forma más rápida de
                    escribir un prompt que funcione a la primera. Así se aplica cada una.
                </p>

                <h2>Paso a paso</h2>
                <div className="ait-steps">
                    <Step n={1} title="Indica qué papel debe adoptar la IA">
                        <p>Dale a la IA una perspectiva para que use el tono y la experiencia adecuados. «Actúa como un tutor de matemáticas paciente» produce un resultado muy distinto a «actúa como un revisor crítico».</p>
                        <PromptExample label="Ejemplo">Actúa como un orientador profesional amable que explica las cosas de forma sencilla.</PromptExample>
                    </Step>
                    <Step n={2} title="Explica la tarea con claridad">
                        <p>Indica exactamente qué quieres, con un verbo de acción claro: resume, reescribe, compara, esquematiza, genera, critica. Evita verbos vagos como «ayúdame con».</p>
                        <PromptExample label="Ejemplo">Reescribe el resumen de mi currículum para que destaque el liderazgo y los resultados medibles.</PromptExample>
                    </Step>
                    <Step n={3} title="Añade contexto">
                        <p>Aporta los detalles que la IA no puede conocer: tu público, tu objetivo, datos relevantes y cualquier material con el que trabajar. El contexto suele marcar la diferencia entre algo genérico y algo útil.</p>
                        <PromptExample label="Ejemplo">Contexto: soy enfermero con 6 años de experiencia y me postulo a un puesto de enfermero jefe. Este es mi resumen actual: [pega tu propio texto].</PromptExample>
                    </Step>
                    <Step n={4} title="Elige el formato de salida">
                        <p>Indícale a la IA cómo quieres la respuesta: una lista con viñetas, una tabla, un párrafo corto, JSON, un correo o un plan paso a paso. Definir el formato desde el principio evita rehacer el trabajo.</p>
                        <PromptExample label="Ejemplo">Dame tres versiones como párrafos cortos, cada uno de menos de 60 palabras.</PromptExample>
                    </Step>
                    <Step n={5} title="Añade restricciones">
                        <p>Establece límites: longitud, tono, nivel de lectura, qué evitar y qué incluir. Las restricciones mantienen la respuesta enfocada.</p>
                        <PromptExample label="Ejemplo">Mantén un tono profesional, evita las palabras de moda y no inventes puestos ni fechas que no te haya dado.</PromptExample>
                    </Step>
                    <Step n={6} title="Pide revisiones">
                        <p>La primera respuesta es un borrador. Mejórala con preguntas de seguimiento concretas en lugar de empezar de cero. Señala la parte exacta que quieres cambiar.</p>
                        <PromptExample label="Ejemplo">La versión 2 es la más cercana. Hazla un 20 % más corta y empieza por el mejor resultado.</PromptExample>
                    </Step>
                    <Step n={7} title="Guarda prompts reutilizables">
                        <p>Cuando un prompt funciona bien, guárdalo como plantilla con marcadores de posición. La próxima vez, cambia los detalles y reutiliza la estructura.</p>
                        <PromptExample label="Plantilla">Actúa como [rol]. [Tarea] para [público]. Contexto: [detalles]. Formato: [formato]. Restricciones: [límites].</PromptExample>
                    </Step>
                </div>

                <h2>Ejemplo de buen prompt</h2>
                <Callout tone="good" title="Claro, específico y estructurado">
                    <PromptExample>Actúa como corrector de textos. Reescribe el párrafo de abajo para un público general con un nivel de lectura sencillo. Que tenga menos de 120 palabras, mantén todos los datos sin cambios y devuelve solo el párrafo corregido. Párrafo: [pega el texto].</PromptExample>
                </Callout>

                <h2>Ejemplo de mal prompt</h2>
                <Callout tone="bad" title="Vago: la IA tiene que adivinar">
                    <PromptExample>mejora esto</PromptExample>
                    <p>Sin rol, sin público, sin formato, sin longitud y sin texto adjunto. Espera una respuesta genérica.</p>
                </Callout>

                <h2>Antes y después</h2>
                <Callout tone="bad" title="Antes">
                    <PromptExample>escribe sobre el cambio climático</PromptExample>
                </Callout>
                <Callout tone="good" title="Después">
                    <PromptExample>Actúa como divulgador científico. Escribe una explicación de 150 palabras sobre por qué las ciudades se sienten más calurosas que las zonas rurales cercanas, para adolescentes curiosos. Usa una analogía cotidiana, evita la jerga y termina con un consejo práctico.</PromptExample>
                </Callout>

                <h2>Errores comunes de principiante</h2>
                <ul className="ait-list">
                    <li>Ser demasiado vago: sin rol, público ni formato.</li>
                    <li>Pedir todo en un solo prompt gigante en lugar de por pasos.</li>
                    <li>No dar el texto o los datos con los que la IA debe trabajar.</li>
                    <li>Aceptar la primera respuesta sin pedir una revisión.</li>
                    <li>Confiar en el resultado sin verificar los datos.</li>
                </ul>

                <h2>Privacidad y seguridad</h2>
                <Callout tone="warn" title="Recordatorio de privacidad y seguridad">
                    <ul className="ait-list">
                        <li>No pegues datos privados, contraseñas, claves de API ni archivos confidenciales en las herramientas de IA.</li>
                        <li>Las interfaces cambian con frecuencia: revisa siempre la configuración y los términos oficiales más recientes.</li>
                        <li>Revisa cada resultado antes de confiar en él, publicarlo o actuar en consecuencia.</li>
                        <li>Verifica la información importante en una fuente de confianza.</li>
                    </ul>
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
                        <a className="ait-link-btn" href="/guides/ai-prompt-writing">Read this guide in English</a>
                    </div>
                </div>
            </section>
        </div>
    );
}
