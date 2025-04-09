export function getCyElement(testname: string) {
  return cy.get(`[data-testid=${testname}]`);
}

describe("Application dashboard", () => {
  before(() => cy.visit("/"));
  describe("I upload a CSV file", () => {
    it("When I select a file called 'users.csv'", () => {
      getCyElement("upload-button").selectFile(
        "./__tests__/fixtures/users.csv"
      );
    });

    it("And I click the 'confirm upload' button", () => {
      cy.intercept("POST", "/api/files").as("upload");
      getCyElement("upload-file").click();
      cy.wait("@upload");
    });

    it("And I search for 'John' in the search field", () => {
      getCyElement("search-input").type("John");
    });

    it("Then I should see the 'John Doe' and 'Mike Johnson' cards", () => {
      cy.contains("John Doe");
      cy.contains("Mike Johnson");
    });
  });

  describe("I cancel a file upload", () => {
    it("When I select a file called 'users.csv'", () => {
      getCyElement("upload-button").selectFile(
        "./__tests__/fixtures/users.csv"
      );
    });

    it("And I click the 'remove file' button", () => {
      getCyElement("remove-file").click();
    });

    it("Then I should no longer see the upload confirmation options", () => {
      getCyElement("upload-file").should("not.be.visible");
      getCyElement("remove-file").should("not.be.visible");
    });
  });

  describe("I see a call to action to search for users", () => {
    it("Given the search field is empty", () => {
      getCyElement("search-input").clear();
    });

    it("Then I should see a call to action inviting me to search for users", () => {
      cy.contains("No user found. Upload a new file or update your search!");
    });
  });

  describe("I see an error after inserting invalid characters into search field", () => {
    it("Given the search field is empty", () => {
      getCyElement("search-input").clear();
    });

    it("When I type '   ' in the search field", () => {
      getCyElement("search-input").type("   ");
    });

    it("Then I should see the 'Invalid query string' error", () => {
      cy.contains("Invalid query string");
    });
  });

  describe("I close an error popup", () => {
    it("Given theres an error popup on screen", () => {
      cy.contains("Invalid query string");
    });

    it("When I click the 'Close error popup' button on the popup", () => {
      getCyElement("close-error").click();
    });

    it("Then I should no longer see a error popup", () => {
      getCyElement("error-popup").should("not.exist");
    });
  });

  describe("I search for users that match the 'An' keyword", () => {
    it("Given the search field is empty", () => {
      getCyElement("search-input").clear();
    });

    it("When I insert 'An' into the search field", () => {
      getCyElement("search-input").type("An");
    });

    it("Then I should see the 4 users whose information contains 'An'", () => {
      cy.contains("Jane Smith");
      cy.contains("Mike Johnson");
      cy.contains("Karen Lee");
      cy.contains("Emma Wilson");
    });
  });

  describe("I search with mixed character cases", () => {
    it("Given the search field is empty", () => {
      getCyElement("search-input").clear();
    });

    it("When I insert 'jAne sMItH' into the search field", () => {
      getCyElement("search-input").type("jAne sMItH");
    });

    it("Then I should see 'Jane Smith' info card", () => {
      cy.contains("Jane Smith");
    });
  });
});
