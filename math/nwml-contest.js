/**
 * NWML Contest Library
 * A JavaScript library for rendering math contest problems from XML files
 */

class NWMLContest {
  constructor(options = {}) {
    this.containerId = options.containerId || "goeshere";
    this.showSolutionsCheckboxId =
      options.showSolutionsCheckboxId || "showSolutions";
    this.contestSelectId = options.contestSelectId || "contest-select";

    // Initialize MathJax configuration
    this.initMathJax();
  }

  initMathJax() {
    if (typeof MathJax === "undefined") {
      window.MathJax = {
        tex: {
          inlineMath: [["\\(", "\\)"]],
        },
        svg: {
          fontCache: "global",
        },
      };
    }
  }

  textToParagraph(text) {
    const container = document.createElement("div");
    
    // Split text into blocks (paragraphs and lists)
    const blocks = text.trim().split(/\n\s*\n/);
    
    for (let block of blocks) {
      block = block.trim();
      if (!block) continue;
      
      // Check if this block is a list (lines starting with -)
      const lines = block.split('\n');
      const isListBlock = lines.every(line => {
        const trimmed = line.trim();
        return trimmed.startsWith('-') || trimmed === '';
      });
      
      if (isListBlock && lines.some(line => line.trim().startsWith('-'))) {
        // Create an unordered list
        const ul = document.createElement("ul");
        for (let line of lines) {
          line = line.trim();
          if (!line || !line.startsWith('-')) continue;
          
          // Remove the leading dash and trim
          const listItemText = line.substring(1).trim();
          const li = document.createElement("li");
          li.textContent = listItemText;
          
          // Apply markdown formatting to list item
          li.innerHTML = this.applyMarkdownFormatting(li.innerHTML);
          ul.appendChild(li);
        }
        container.appendChild(ul);
      } else {
        // Create a paragraph
        const paragraph = document.createElement("p");
        paragraph.textContent = block;
        
        // Apply markdown formatting
        paragraph.innerHTML = this.applyMarkdownFormatting(paragraph.innerHTML);
        container.appendChild(paragraph);
      }
    }
    
    // If only one child, return that child instead of the wrapper
    if (container.children.length === 1) {
      return container.children[0];
    }
    
    return container;
  }

  applyMarkdownFormatting(html) {
    // replace markdown bold with HTML bold (but not ** in LaTeX)
    html = html.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

    // replace markdown links with HTML links
    html = html.replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" target="_blank">$1</a>'
    );

    // Replace $$...$$ with \[ ... \]
    const blockPattern = /\$\$([^$]*[^\s$])\$\$/g;
    html = html.replace(blockPattern, "\\[ $1 \\]");
    
    // Replace $...$ with \( ... \)
    const latexPattern = /\$([^$]*[^\s$])\$/g;
    html = html.replace(latexPattern, "\\( $1 \\)");
    
    return html;
  }

  getProblems(doc) {
    const problems = doc.getElementsByTagName("problem");
    const problemList = document.createElement("ol");

    for (let i = 0; i < problems.length; i++) {
      const problem = problems[i];
      const listItem = document.createElement("li");
      problemList.appendChild(listItem);
      const problemElement = document.createElement("div");
      problemElement.setAttribute("class", "container");
      listItem.appendChild(problemElement);

      const questionWrapper = problem.getElementsByTagName("question")[0];
      const questionParts = questionWrapper.childNodes;
      for (let j = 0; j < questionParts.length; j++) {
        const questionPart = questionParts[j];
        if (questionPart.tagName === "text") {
          const question = this.textToParagraph(questionPart.textContent);
          problemElement.appendChild(question);
        } else if (questionPart.tagName === "image") {
          if (questionPart.getAttribute("src")) {
            const image = document.createElement("img");
            image.src = questionPart.getAttribute("src");
            image.setAttribute("class", "image");
            let width = "300";
            if (questionPart.getAttribute("width")) {
              width = questionPart.getAttribute("width");
            }

            image.setAttribute("width", width);
            problemElement.appendChild(image);
          } else {
            const image = questionPart.getElementsByTagName("svg")[0];
            image.setAttribute("class", "image");
            problemElement.appendChild(image);
          }
        }
      }

      const answerDiv = document.createElement("div");
      // get the "answers" tag if it exists
      const answers = problem.getElementsByTagName("answers");
      if (answers.length > 0) {
        const answerElements = answers[0].getElementsByTagName("answer");
        for (var j = 0; j < answerElements.length; j++) {
          var answerElement = answerElements[j];

          const answer = document.createElement("span");

          if (answerElement.getAttribute("correct")) {
            answer.setAttribute("class", "correct answer");
          } else {
            answer.setAttribute("class", "answer");
          }
          const letter = String.fromCharCode(65 + j); // Generate letter (A, B, C, etc.)
          // Replace $...$ with \( ... \)
          const latexPattern = /\$([^$]*[^\s$])\$/g;
          let answerDisplay = answerElement.textContent.replace(
            latexPattern,
            "\\( $1 \\)"
          );
          if (answerElement.getAttribute("blank")) {
            answerDisplay = `My answer is:
            <span class="myAnswerIsBlank"></span>`;
            if (answerElement.getAttribute("myAnswerIs")) {
              answerDisplay += `
              <span class="myAnswerIs">${answerElement.getAttribute(
                "myAnswerIs"
              )}</span>`;
            }
          }

          answer.innerHTML = `(${letter}) ${answerDisplay}`;
          answerDiv.appendChild(answer);
        }
      }
      problemElement.appendChild(answerDiv);

      const solutions = problem.getElementsByTagName("solution");
      if (solutions.length > 0) {
        const solutionElement = document.createElement("div");
        solutionElement.setAttribute("class", "solution");
        const solutionParts = solutions[0].childNodes;
        for (let j = 0; j < solutionParts.length; j++) {
          const solutionPart = solutionParts[j];
          let solution;
          switch (solutionPart.tagName) {
            case "text":
              solution = this.textToParagraph(solutionPart.textContent);
              solutionElement.appendChild(solution);
              break;
            case "image":
              const image = solutionPart.getElementsByTagName("svg")[0];
              image.setAttribute("class", "image");
              solutionElement.appendChild(image);
              break;
            case "html":
              solution = document.createElement("div");
              solution.innerHTML = solutionPart.innerHTML;
              // Replace $...$ with \( ... \)
              const latexPattern = /\$([^$]*[^\s$])\$/g;
              solution.innerHTML = solution.innerHTML.replace(
                latexPattern,
                "\\( $1 \\)"
              );
              solutionElement.appendChild(solution);
              break;
          }
          problemElement.appendChild(solutionElement);
        }
      }
    }
    return problemList;
  }

  evaluateSolutions(showSolutions) {
    const solutions = document.getElementsByClassName("solution");
    for (let i = 0; i < solutions.length; i++) {
      if (showSolutions) {
        solutions[i].style.display = "inline";
      } else {
        solutions[i].style.display = "none";
      }
    }
    const answers = document.getElementsByClassName("correct");
    for (let i = 0; i < answers.length; i++) {
      if (showSolutions) {
        answers[i].style.border = "2px solid green";
      } else {
        answers[i].style.border = "none";
      }
      if (answers[i].getElementsByClassName("myAnswerIs").length > 0) {
        answers[i].getElementsByClassName("myAnswerIs")[0].style.display =
          showSolutions ? "inline" : "none";
        answers[i].getElementsByClassName("myAnswerIsBlank")[0].style.display =
          showSolutions ? "none" : "inline-block";
      }
    }
  }

  hasSolutions(doc) {
    const problems = doc.getElementsByTagName("problem");
    for (let i = 0; i < problems.length; i++) {
      const solutions = problems[i].getElementsByTagName("solution");
      if (solutions.length > 0) {
        return true;
      }
    }
    return false;
  }

  toggleSolutionsUI(show) {
    const showSolutionsCheckbox = document.getElementById(
      this.showSolutionsCheckboxId
    );
    const solutionsLabel = document.querySelector(
      `label[for="${this.showSolutionsCheckboxId}"]`
    );
    const solutionsContainer = document.querySelector(".solutions-toggle");

    if (showSolutionsCheckbox) {
      showSolutionsCheckbox.style.display = show ? "inline" : "none";
    }
    if (solutionsLabel) {
      solutionsLabel.style.display = show ? "inline" : "none";
    }
    if (solutionsContainer) {
      solutionsContainer.style.display = show ? "inline" : "none";
    }
  }

  getTitle(doc) {
    const date = new Date(doc.documentElement.getAttribute("date"));
    // https://www.youtube.com/watch?v=oKFb2Us9kmg
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/Los_Angeles",
    };
    const formattedDate = date.toLocaleDateString("en-US", options);

    const host = doc.documentElement.getAttribute("host");
    const contest = doc.documentElement.getAttribute("contest");

    const title = document.createElement("h2");
    // capitalize first letter of contest
    let contestDisp = contest.charAt(0).toUpperCase() + contest.slice(1);
    const solutionPrefix = document.createElement("span");
    solutionPrefix.textContent = "Solutions for ";
    solutionPrefix.setAttribute("class", "solution");
    title.appendChild(solutionPrefix);
    const titleMain = document.createElement("span");
    titleMain.textContent = `${contestDisp}${
      contest === "warmup" ? "" : " Contest"
    }, ${formattedDate} at ${host}`;
    title.appendChild(titleMain);
    return title;
  }

  loadContest(xmlFile) {
    return fetch(xmlFile)
      .then((response) => response.text())
      .then((text) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/xml");

        const destination = document.getElementById(this.containerId);
        destination.innerHTML = "";
        destination.appendChild(this.getTitle(doc));
        const problemList = this.getProblems(doc);
        destination.appendChild(problemList);

        if (typeof MathJax !== "undefined" && MathJax.typeset) {
          MathJax.typeset();
        }

        // Update contest select if it exists
        const contestSelect = document.getElementById(this.contestSelectId);
        if (contestSelect) {
          contestSelect.value = xmlFile;
        }

        // Check if there are solutions and toggle UI accordingly
        const hasSolutions = this.hasSolutions(doc);
        this.toggleSolutionsUI(hasSolutions);

        // Reset solutions checkbox
        const showSolutionsCheckbox = document.getElementById(
          this.showSolutionsCheckboxId
        );
        if (showSolutionsCheckbox) {
          showSolutionsCheckbox.checked = false;
        }

        this.evaluateSolutions(false);
      });
  }

  // Helper method to set up event listeners
  setupEventListeners() {
    const showSolutionsCheckbox = document.getElementById(
      this.showSolutionsCheckboxId
    );
    if (showSolutionsCheckbox) {
      showSolutionsCheckbox.addEventListener("change", (e) => {
        this.evaluateSolutions(e.target.checked);
      });
    }

    const contestSelect = document.getElementById(this.contestSelectId);
    if (contestSelect) {
      contestSelect.addEventListener("change", (e) => {
        this.loadContest(e.target.value);
      });
    }
  }
}

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = NWMLContest;
}
