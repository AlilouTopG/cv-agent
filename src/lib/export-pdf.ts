export interface ExportOptions {
  filename?: string;
  scale?: number;
}

export async function exportNodeToPDF(
  node: HTMLElement,
  options: ExportOptions = {}
): Promise<void> {
  const { filename = "nemvai-resume.pdf", scale = 3 } = options;

  const html2pdf = (await import("html2pdf.js")).default;

  const clone = node.cloneNode(true) as HTMLElement;
  clone.style.width = "100%";
  clone.style.margin = "0";
  clone.style.position = "static";

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-100000px";
  container.style.top = "0";
  container.style.width = "794px";
  container.style.zIndex = "-1";
  container.style.overflow = "hidden";
  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    const worker = html2pdf();
    type SetOptions = Parameters<(typeof worker)["set"]>[0];

    const options = {
      filename,
      margin: [0.45, 0.5, 0.45, 0.5],
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        windowWidth: 794,
        logging: false,
      },
      jsPDF: {
        unit: "in",
        format: "letter",
        orientation: "portrait",
      },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    } as unknown as SetOptions;

    await worker.set(options).from(clone).save();
  } finally {
    if (container.parentNode === document.body) {
      document.body.removeChild(container);
    }
  }
}
