Feature: Running the wikicommand returns an embd with a description and a title
  Scenario: First time searching for a word
    Given a user
    When the user runs the command wiki with the argument "cat"
    Then the output should be a json with an embed containing a description and a title
  Scenario: Second time searching for a word
    Given a user
    When the user runs the command wiki with the argument "cat" again
    Then the output should be a json with an embed containing a description and a title but the article should be pulled from cache

