// This is the preferred way to include a css file.
import "./style.css";

import { getById } from "phil-lib/client-misc";

// getById() is usually the first function I import.
// This is the best way to access HTML from TypeScript most of the time.
const typescriptStatusSpan = getById("typescriptStatus", HTMLSpanElement);
typescriptStatusSpan.innerText = "working";
