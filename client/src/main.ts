import * as WebGL from "./common/webgl.ts";

import { createRenderFunction, RenderFunction } from "./images.ts";
import { AlgorithmFunction, createAlgorithmFunction } from "./algorithm.ts";

const SLIDER_POPULATION: string = "#slider-population";
const SLIDER_POPULATION_TITLE: string = "#slider-population-title";
const SLIDER_TRIANGLES: string = "#slider-triangles";
const SLIDER_TRIANGLES_TITLE: string = "#slider-triangles-title";
const SLIDER_MUTATION: string = "#slider-mutation";
const SLIDER_MUTATION_TITLE: string = "#slider-mutation-title";
const SLIDER_RESOLUTION: string = "#slider-resolution";
const SLIDER_RESOLUTION_TITLE: string = "#slider-resolution-title";
const SLIDER_TOURNAMENT: string = "#slider-tournament";
const SLIDER_TOURNAMENT_TITLE: string = "#slider-tournament-title";

const GENERATIONS: string = "#generations";
const FITNESS: string = "#fitness";
const PERFORMANCE: string = "#performance";

const CONTENT_IMAGE_UPLOAD: string = "#content-image-upload";
const CONTENT_IMAGE_REFERENCE: string = "#content-image-reference";
const CONTENT_IMAGE_GENERATED: string = "#content-image-generated";

interface Application {
  triangles: number;
  population: number;
  mutation: number;
  resolution: number;
  tournament: number;
  timepoint: number;
  genrations: number;
  update: RenderFunction | null;
  algorithm: AlgorithmFunction | null;
}

const application: Application = {
  triangles: 0,
  population: 0,
  mutation: 0,
  resolution: 0,
  tournament: 0,
  timepoint: 0,
  genrations: 0,
  update: null,
  algorithm: null,
};

function setupSliderUpdateCallback(
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

function setupPopulationSliderElement(): void {
  const title = document.querySelector(SLIDER_POPULATION_TITLE) as
    | HTMLHeadingElement
    | null;
  setupSliderUpdateCallback(
    SLIDER_POPULATION,
    (value: number) => {
      application.population = Math.pow(2, value);
      if (title) {
        title.innerText = `POPULATION (${Math.pow(2, value)})`;
      }
    },
  );
}

function setupTrianglesSliderElement(): void {
  const title = document.querySelector(SLIDER_TRIANGLES_TITLE) as
    | HTMLHeadingElement
    | null;
  setupSliderUpdateCallback(
    SLIDER_TRIANGLES,
    (value: number) => {
      application.triangles = value || 1;
      if (title) {
        title.innerText = `TRIANGLES (${value || 1})`;
      }
    },
  );
}

function setupMutationSliderElement(): void {
  const title = document.querySelector(SLIDER_MUTATION_TITLE) as
    | HTMLHeadingElement
    | null;
  setupSliderUpdateCallback(
    SLIDER_MUTATION,
    (value: number) => {
      application.mutation = value;
      if (title) {
        title.innerText = `MUTATION (${Math.floor(value * 10000.0) / 100.0}%)`;
      }
    },
  );
}

function setupTournamentSliderElement(): void {
  const title = document.querySelector(SLIDER_TOURNAMENT_TITLE) as
    | HTMLHeadingElement
    | null;
  setupSliderUpdateCallback(
    SLIDER_TOURNAMENT,
    (value: number) => {
      application.tournament = value;
      if (title) {
        title.innerText = `TOURNAMENT (${value})`;
      }
    },
  );
}

function setupResolutionSliderElement(): void {
  const title = document.querySelector(SLIDER_RESOLUTION_TITLE) as
    | HTMLHeadingElement
    | null;
  setupSliderUpdateCallback(
    SLIDER_RESOLUTION,
    (value: number) => {
      application.resolution = value;
      if (title) {
        title.innerText = `RESOLUTION (${value}x${value})`;
      }
    },
  );
}

function startLoadingImageReference(file: File): void {
  const image = document.querySelector(CONTENT_IMAGE_REFERENCE) as
    | HTMLImageElement
    | null;
  if (image) {
    const context = new FileReader();
    context.addEventListener(
      "load",
      (event: ProgressEvent<FileReader>) => {
        const source = event.target?.result as string | null;
        if (source) {
          image.src = source;
        }
      },
    );
    context.readAsDataURL(file);
  }
}

function setupImageReferenceElement(): void {
  const image = document.querySelector(CONTENT_IMAGE_REFERENCE) as
    | HTMLImageElement
    | null;
  if (image) {
    image.addEventListener(
      "load",
      () => {
        setupImageGeneratedElement();
        (document.querySelector("#content-upload") as HTMLDivElement).style
          .display = "none";
        (document.querySelector("#content-images") as HTMLDivElement).style
          .display = "inline";
      },
    );
  }
}

function setupImageUploadElement(): void {
  const input = document.querySelector(CONTENT_IMAGE_UPLOAD) as
    | HTMLInputElement
    | null;
  if (input) {
    input.addEventListener(
      "change",
      (event: Event) => {
        const files = (event.target as HTMLInputElement | null)?.files;
        if (files && files.length > 0) {
          startLoadingImageReference(files[0]);
        }
      },
    );
  }
}

function setupImageGeneratedElement(): void {
  const image = document.querySelector(CONTENT_IMAGE_REFERENCE) as
    | HTMLImageElement
    | null;
  const canvas = document.querySelector(CONTENT_IMAGE_GENERATED) as
    | HTMLCanvasElement
    | null;
  if (image && canvas) {
    canvas.width = image.width;
    canvas.height = image.height;

    const context = canvas.getContext("webgl2");
    if (context) {
      WebGL.enableAlphaBlending(context, WebGL.ONE_MINUS_SRC_ALPHA);
      setupUpdateFunction(context);
      setupAlgorithmFunction(context);
    } else {
      throw new Error("WebGL2 isn't supported!");
    }
  }
}

function setupUpdateFunction(context: WebGL.Context): void {
  const canvas = document.querySelector(CONTENT_IMAGE_GENERATED) as
    | HTMLCanvasElement
    | null;
  if (canvas) {
    application.update = createRenderFunction(
      context,
      canvas.width,
      canvas.height,
      application.triangles,
      1,
    );
  }
}

function setupAlgorithmFunction(context: WebGL.Context): void {
  const image = document.querySelector(CONTENT_IMAGE_REFERENCE) as
    | HTMLImageElement
    | null;
  if (image) {
    application.timepoint = performance.now();
    application.algorithm = createAlgorithmFunction(
      context,
      application.resolution,
      application.resolution,
      application.triangles,
      application.population,
      application.mutation,
      application.tournament,
      image,
    );
  }
}

function updateGenerationsElement(): void {
  const element = document.querySelector(GENERATIONS) as
    | HTMLHeadingElement
    | null;
  if (element) {
    element.textContent = `${application.genrations}`;
  }
}

function updateFitnessElement(fitness: Float32Array): void {
  const element = document.querySelector(FITNESS) as
    | HTMLHeadingElement
    | null;
  if (element) {
    element.textContent = `${
      (fitness.reduce((maximum, value) => Math.max(maximum, value)) / 255.0)
        .toFixed(8)
    }`;
  }
}

function updatePerformanceElement(): void {
  const element = document.querySelector(PERFORMANCE) as
    | HTMLHeadingElement
    | null;
  if (element) {
    const duration = (performance.now() - application.timepoint) / 1000.0;
    element.textContent = `${
      (application.genrations / duration)
        .toFixed(3)
    } / S`;
  }
}

self.addEventListener("load", () => {
  setupImageUploadElement();
  setupImageReferenceElement();

  setupPopulationSliderElement();
  setupTrianglesSliderElement();
  setupMutationSliderElement();
  setupTournamentSliderElement();
  setupResolutionSliderElement();

  setInterval(() => {
    if (application.algorithm) {
      const [fitness, vertices] = application.algorithm.call();
      if (application.update) {
        application.genrations++;

        updateGenerationsElement();
        updateFitnessElement(fitness);
        updatePerformanceElement();

        application.update.call(
          vertices.subarray(
            0,
            application.triangles * 18,
          ),
        );
      }
    }
  }, 0);
});
