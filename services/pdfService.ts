
import { jsPDF } from "jspdf";
import { AppealData } from "../types";

export const generateAppealPdf = (data: AppealData) => {
  const doc = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4",
  });

  const margin = 25;
  const pageWidth = 210;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const setFontBody = () => {
    doc.setFont("times", "normal");
    doc.setFontSize(11);
  };

  const setFontBold = () => {
    doc.setFont("times", "bold");
    doc.setFontSize(11);
  };

  const addText = (text: string, isBold = false, align: "left" | "center" | "justify" = "justify") => {
    if (isBold) setFontBold();
    else setFontBody();

    const splitText = doc.splitTextToSize(text, contentWidth);
    
    if (y + splitText.length * 5 > 280) {
        doc.addPage();
        y = 25;
    }

    doc.text(splitText, margin, y, { align: align === "justify" ? "left" : align, maxWidth: contentWidth });
    y += splitText.length * 5 + 2;
  };

  const addSpace = (mm: number) => {
    y += mm;
  };

  const checkPageBreak = (spaceNeeded: number = 20) => {
    if (y + spaceNeeded > 280) {
      doc.addPage();
      y = 25;
    }
  }

  // --- HEADER ---
  setFontBody();
  doc.text(`A (1) ${data.organo.toUpperCase()}`, margin, y);
  y += 10;

  setFontBold();
  doc.text(`EXPTE. Nº ${data.expediente}`, margin, y);
  y += 15;

  // --- PERSONAL DATA ---
  setFontBody();
  doc.text(`${data.fullName}, con`, margin, y);
  y += 7;
  doc.text(`DNI ${data.dni}, domicilio en ${data.address}`, margin, y);
  y += 7;
  doc.text(`comparezco y expongo`, margin + 50, y); // Indented slightly
  y += 10;

  // --- INTRO ---
  addText(`Que me ha sido notificada denuncia en el expediente de referencia, por infracción de (2) ${data.infringement}`);
  addText(`Consistente en (3) ${data.fact}`);
  addSpace(5);
  addText(`Que no estando conforme formulo (4) ${data.allegationType} en base a lo siguiente:`);
  addSpace(5);

  // --- ALLEGATIONS (1-10) ---
  
  const allegations = [
    "1) Lo diga o no el boletín de denuncia, el vehículo denunciado dispone de los dispositivos homologados de preseñalización de vehículo inmovilizado en la vía, incluyendo la función de geolocalización.",
    
    "2) La baliza V16 geolocalizable viene regulada en el apartado dos de la disposición final primera del Real Decreto 1030/2022, que la define fraudulentamente como “V-16 dispositivo de preseñalización de peligro”. Esa definición es fraudulenta, por cuanto no PRE señaliza nada, al estar diseñada para ir situada sobre el techo del vehículo inmovilizado. Los triángulos a los que sustituye, efectivamente PRE señalizan, al estar diseñados para situarse a cierta distancia del vehículo inmovilizado, de modo que en un cambio de rasante o una curva sin visibilidad, el vehículo que se acerque al inmovilizado es PRE advertido de su presencia, antes de llegar a ver el vehículo inmovilizado, pudiendo acomodar su circulación a la existencia del obstáculo. En suma, su propia definición es un fraude, que plasmado en una norma jurídica, constituye el fraude de ley prohibido por el art. 6 del Código Civil.",
    
    "3) La baliza V16 geolocalizable no es reglamentaria en ningún otro país del mundo, prueba evidente de que se trata de un experimento, en el que los ciudadanos españoles somos los conejillos de indias. El vehículo español que circule por cualquier otro país deberá llevar los tradicionales e inveterados triángulos, o se arriesga a ser sancionado. Sin embargo, el vehículo extranjero que circule por España, no está obligado a llevar este fraudulento dispositivo, creando una discriminación, proscrita por el art 14 de la Constitución.",
    
    "4) Al tratarse de un dispositivo alimentado por baterías, pero de uso extraordinario, la arbitraria autoridad que ha decidido imponer su uso finge ignorar que en pocos años, la mayoría del parque de balizas estará inutilizado por el agotamiento de su batería, lo que no ocurre con los tradicionales triángulos. Es decir, que lejos de ser la mejora que se nos quiere vender mediante otro abuso de la propaganda, se convertirá en poco tiempo en una trampa mortal para los usuarios de la vía pública. Por pura lógica, los elementos de emergencia deberían estar diseñados a prueba de imprevistos y emergencias, lo que no ocurre con esta baliza.",
    
    "5) La supuesta finalidad y mejora respecto a los tradicionales triángulos, consistente en su conectividad, pero es en realidad una innecesaria redundancia, es decir, una arbitrariedad, ya que todos los vehículos matriculados con posterioridad al 6 de julio de 2024 incorporan el ADAS, que cumple la misma función, y la inmensa mayoría de los conductores y pasajeros llevan su propio teléfono móvil, con la misma utilidad.",
    
    "6) Por sus innegables desventajas respecto a los triángulos, estar sus presuntas ventajas anuladas por la redundancia y por ser discriminatoria, es una medida de todo punto desproporcionada, y por lo tanto ilegal, de acuerdo a lo dispuesto en el art. 4 de la Ley 40/2015 de Régimen Jurídico del Sector Público.",
    
    "7) No existe norma legal que contemple y tipifique como infracción la tenencia y uso de los triángulos de preseñalización, en lugar de la baliza V16 geolocalizable, para señalizar un vehículo inmovilizado en la vía. Es decir, que la supuesta infracción se constituye mediante lo que se denomina “norma penal en blanco”, infringiendo el derecho fundamental del principio de legalidad de las normas sancionadoras (art. 25 C.E.). Por todas, la Sentencia del Tribunal Constitucional 97/2009, que en su fundamento jurídico 3 establece:",
    
    "Tal y como hemos recordado recientemente en la Sentencia 162/2008, de 15 de diciembre, FJ 1, con afán sistematizador de la doctrina previa, el art. 25.1 CE comprende tanto una garantía formal como una garantía material. La garantía material, tal y como establece, por todas, la STC 242/2005, de 10 de octubre, FJ 2, «aparece derivada del mandato de taxatividad o de lex certa y se concreta en la exigencia de predeterminación normativa de las conductas ilícitas y de las sanciones correspondientes, que hace recaer sobre el legislador el deber de configurarlas en las leyes sancionadoras con la mayor precisión posible para que los ciudadanos puedan conocer de antemano el ámbito de lo proscrito y prever, así, las consecuencias de sus acciones». La garantía formal de reserva de ley, por su parte, aun cuando se manifiesta con cierta relatividad en el ámbito sancionador administrativo, por cuanto «no cabe excluir la colaboración reglamentaria en la propia tarea de tipificación de las infracciones y atribución de las correspondientes sanciones, aunque sí hay que excluir el que tales remisiones hagan posible una regulación independiente y no claramente subordinada a la ley», se traduce, en definitiva, en que «la ley debe contener la determinación de los elementos esenciales de la conducta antijurídica y al reglamento sólo puede corresponder, en su caso, el desarrollo y precisión de los tipos de infracciones previamente establecidos por la ley»",
    
    "Es decir, que para que la remisión de la ley punitiva sea constitucional debe cumplir los siguientes principios básicos:\n\n• Núcleo esencial del tipo penal: El legislador debe delimitar el núcleo esencial del tipo penal. La ley principal debe contener la pena, el sujeto pasivo, el verbo y, en la medida de lo posible, los elementos de la acción típica. Nada de eso ocurre en este caso.\n\n• Remisión a una norma de rango legal o reglamentario: La norma a la que se remite (la \"norma en blanco\") puede ser de rango legal o reglamentario, pero debe estar preexistente para garantizar la seguridad jurídica. La ley aplicada en este caso no remite expresamente a reglamento alguno. Es decir, que supone que el ciudadano debe conocerse de memoria todos los reglamentos y normativa complementaria sobre la materia, lo que excede la obligación legal de todo ciudadano.\n\n• Contenido de la remisión: La norma a la que se remite debe complementar la ley principal, no crear un nuevo ilícito. Esto significa que no debe incluir un nuevo tipo penal, sino solo completar los detalles técnicos o normativos del tipo ya establecido. Dado que el contenido principal no aparece expresamente reflejado en la ley, es todo él creado ex novo en el reglamento.\n\n• Imposibilidad de remisión a normas indeterminadas: La ley principal no puede remitirse a una norma indeterminada o de rango inferior a la ley, como una disposición administrativa que no esté previamente publicada, que es lo que ocurre en este caso.",
    
    "8) Para verificar que la obligación de utilizar la baliza V16 geolocalizable es necesaria, eficaz, proporcional, no discriminatoria, y que no hay alternativa mejor ni menos restrictiva para lograr el mismo fin, es decir, que cumple los requisitos previstos en el art. 4 de la Ley 40/2015 y en el art. 129 de la Ley 39/2015, debe solicitarse al Ministerio del Interior que incorpore al presente expediente sancionador el expediente de elaboración del real decreto 1030/2022, en el que forzosamente deben constar los informes técnicos y científicos que avalen el cumplimiento de estas condiciones. En caso contrario nos encontraremos en un típico caso de arbitrariedad de los poderes públicos, proscrita por el art. 9.3 C.E.",
    
    "9) Aunque la propaganda afirma que la geolocalización de la baliza no se puede activar por extraños ajenos al usuario del vehículo, el riesgo de que un dispositivo interconectado sea objeto de una intrusión existe, exactamente igual que con los teléfonos móviles, violando el derecho fundamental a la intimidad (art. 18 C.E. y la LOPD 3/2018). En todo caso, la activación de la baliza remite información directamente y de forma involuntaria, violando con ello el principio de consentimiento del afectado (art. 6 LOPD). El tratamiento se hace sin una información previa del afectado, violando el principio de transparencia (art. 11 LOPD). En la adquisición no se informa al comprador de ninguno de los datos antedichos, ni del nombre y cargo del responsable y encargado del tratamiento de los datos emitidos, violando lo dispuesto en la LOPD.",
    
    "10) La propia Constitución establece, además del principio de legalidad de las normas sancionadoras, el principio de seguridad jurídica. El art. 6 del Código Civil dispone que “la ignorancia de las leyes no exime de su cumplimiento”, elemento básico del principio de legalidad de las normas sancionadoras. En el momento de aprobarse el Código Civil, en 1889, el corpus legislativo español superaba por poco las 100 leyes, que con mucho esfuerzo podían llegar a conocerse. Actualmente supera con mucho las 50.000 normas con rango de ley, junto a sus equivalentes y otras de rango superior, como los convenios internacionales válidamente suscritos. Si añadimos las normas reglamentarias, a las que se supone remiten las leyes sancionadoras, nos acercamos al millón. Ni siquiera la inteligencia artificial es capaz de aventurar un número más o menos preciso de las leyes y otras normas reglamentarias que hay en vigor, cuanto menos de conocerlas medianamente. Y sin embargo se exige que un ciudadano común se las conozca todas, incluyendo las normas reglamentarias a las que remite (o no remite, como en este caso) la legislación sancionadora."
  ];

  allegations.forEach(paragraph => {
    addText(paragraph);
    addSpace(3);
  });

  // --- SOLICITUD ---
  addSpace(5);
  addText("Por lo expuesto SOLICITO se anule el expediente sancionador de referencia, con expresa declaración de no haberse cometido infracción legal alguna.", true);
  addSpace(8);

  // --- OTROSI DIGO 1 ---
  addText("OTROSI DIGO que en caso contrario, se proceda a incorporar al expediente sancionador los informes técnicos y científicos que forzosamente deben constar en el expediente de elaboración del Real Decreto 1030/2022, sin los cuales la medida se demuestra arbitraria, y por lo tanto inconstitucional. Recuérdese que las afirmaciones de autoridad (magister dixit) o argumentos ad verecundiam (en este caso “lo ha dicho el Gobierno”) no son argumentos científicos.");
  addSpace(5);
  addText("Estos informes científicos deben acreditar, al menos:", false);
  const points1 = [
    "1) Necesidad de un elemento de PRE señalización de vehículo inmovilizado en la vía, diferente de los triángulos admitidos hasta ahora...",
    "2) Eficacia de la baliza V16 geolocalizable...",
    "3) Riesgos y probabilidades de que un elemento como este, de uso ocasional en emergencias, y que precisa de energía eléctrica, se encuentre en el momento de su uso sin energía...",
    "4) Estudio de la proporcionalidad de la medida...",
    "5) Estudio de la discriminación que produce respecto de los millones de vehículos extranjeros..."
  ];
  points1.forEach(p => {
      // Simplified these points for brevity in code, but keeping the gist.
      // In a real full implementation, I'd copy the full text, but for this prompt I will use the full text for correctness.
      let fullText = p; 
      if (p.startsWith("1)")) fullText = "1) Necesidad de un elemento de PRE señalización de vehículo inmovilizado en la vía, diferente de los triángulos admitidos hasta ahora, y que son los únicos elementos admitidos en el resto de países europeos. Respecto de la necesidad, debe tenerse en cuenta que la función de geolocalización ya está incorporada en todos los vehículos matriculados desde julio de 2024 (ADAS) y en todos los teléfonos móviles, siendo por tanto redundante.";
      if (p.startsWith("2)")) fullText = "2) Eficacia de la baliza V16 geolocalizable para PRE señalizar el vehículo inmovilizado en la vía, en diferentes contextos, incluyendo cambios de rasante y curvas sin visibilidad.";
      if (p.startsWith("3)")) fullText = "3) Riesgos y probabilidades de que un elemento como este, de uso ocasional en emergencias, y que precisa de energía eléctrica, se encuentre en el momento de su uso sin energía, dejando al usuario en situación mucho peor que con los triángulos.";
      if (p.startsWith("4)")) fullText = "4) Estudio de la proporcionalidad de la medida, y de los efectos de otras medidas alternativas, incluyendo la actual del uso de los triángulos.";
      if (p.startsWith("5)")) fullText = "5) Estudio de la discriminación que produce respecto de los millones de vehículos extranjeros que circulan por España cada año, que no están obligados a llevar la baliza V16 geolocalizable.";
      
      addText(fullText);
  });

  // --- OTROSI DIGO 2 ---
  addSpace(5);
  addText("SEGUNDO OTROSÍ DIGO: Que intereso la apertura de un periodo probatorio y la práctica de PRUEBA TESTIFICAL, a medio de los funcionarios denunciantes, que habrá de llevarse a cabo de acuerdo con las normas de la LEC para la prueba de testigos, no siendo válida la ratificación escrita, porque de ese modo se privaría al compareciente de intervenir en la práctica de la prueba, siendo éste, como se sabe, un derecho garantizado por la Ley 39/2015 del Procedimiento Administrativo Común de las Administraciones Públicas.");

  // --- SIGNATURE ---
  checkPageBreak(40);
  addSpace(15);
  
  // Date formatting
  const dateObj = new Date(data.signDate);
  const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const day = dateObj.getDate();
  const month = months[dateObj.getMonth()];
  const year = "2025"; // Hardcoded in template but better to use input year if needed. Template says 2025 specifically.
  
  doc.text(`En ${data.signPlace}, a ${day} de ${month} de ${year}`, margin, y);
  addSpace(20);

  doc.text("firma", margin, y);
  addSpace(5);
  // We can add a line or just space
  
  // Footnotes
  y = 260;
  doc.setFontSize(8);
  doc.text("(1) órgano al que se dirige el escrito", margin, y); y+=4;
  doc.text("(2) artículo y norma que se supone que sanciona el hecho.", margin, y); y+=4;
  doc.text("(3) Descripción del hecho sancionable.", margin, y); y+=4;
  doc.text("(4) Escrito de alegaciones o recurso, según proceda", margin, y);

  doc.save(`alegaciones_v16_${data.expediente || 'borrador'}.pdf`);
};
