/** Split long detail text into titled sections for step-by-step display */
export function detailsToGuideSteps(details: string): { title: string; body: string }[] {
  const blocks = details
    .split(/\n\n/)
    .map((b) => b.trim())
    .filter(Boolean);
  const steps: { title: string; body: string }[] = [];

  for (const block of blocks) {
    const lines = block.split("\n");
    const first = lines[0] ?? "";
    const isBoldHeader = /^\*\*[^*]+\*\*$/.test(first.trim());
    if (isBoldHeader) {
      const title = first.replace(/^\*\*|\*\*$/g, "").trim();
      const body = lines.slice(1).join("\n").trim();
      steps.push({ title, body: body || "" });
    } else {
      steps.push({
        title: steps.length === 0 ? "Overview" : `Part ${steps.length + 1}`,
        body: block,
      });
    }
  }

  if (steps.length === 0) return [{ title: "Cultivation guide", body: details }];
  return steps;
}

export function acresToHectares(acres: number): number {
  return acres * 0.40468564224;
}
