import QuickTest "./quick_test";

persistent actor QuickTestActor {
  public query func runBasicTest() : async Text {
    QuickTest.runBasicTest();
  };

  public query func runLogicTest() : async Text {
    QuickTest.runLogicTest();
  };

  public query func runPrincipalTest() : async Text {
    QuickTest.runPrincipalTest();
  };
};
