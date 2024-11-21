function setSliderUpdateCallback(
  query: string,
  updateCallback: (value: number) => void,
): void {
  const slider = document.querySelector(query) as HTMLInputElement | null;
  if (slider) {
    updateCallback(parseFloat(slider.value));
    slider.addEventListener("input", (event: Event) => {
      const value = (event.target as HTMLInputElement | null)?.value;
      if (value) {
        updateCallback(parseFloat(value));
      }
    });
  }
}

function setupPopulationSlider(): void {
  const title = document.querySelector("#slider-population-title") as
    | HTMLHeadingElement
    | null;
  setSliderUpdateCallback(
    "#slider-population",
    (value: number) => {
      if (title) {
        title.innerText = `POPULATION (${value || 1})`;
      }
    },
  );
}

function setupTrianglesSlider(): void {
  const title = document.querySelector("#slider-triangles-title") as
    | HTMLHeadingElement
    | null;
  setSliderUpdateCallback(
    "#slider-triangles",
    (value: number) => {
      if (title) {
        title.innerText = `TRIANGLES (${value || 1})`;
      }
    },
  );
}

function setupMutationSlider(): void {
  const title = document.querySelector("#slider-mutation-title") as
    | HTMLHeadingElement
    | null;
  setSliderUpdateCallback(
    "#slider-mutation",
    (value: number) => {
      if (title) {
        title.innerText = `MUTATION (${value})`;
      }
    },
  );
}

function setupResolutionSlider(): void {
  const title = document.querySelector("#slider-resolution-title") as
    | HTMLHeadingElement
    | null;
  setSliderUpdateCallback(
    "#slider-resolution",
    (value: number) => {
      if (title) {
        title.innerText = `RESOLUTION (${value}x${value})`;
      }
    },
  );
}

self.addEventListener("load", () => {
  setupPopulationSlider();
  setupTrianglesSlider();
  setupMutationSlider();
  setupResolutionSlider();
});
