import HHDAOLib "../src/lib";
import QuickTest "./quick_test";
import TestUtils "../src/test-utils";
import QuickTestActor "./quick_test_combined";
import SimpleTestRunner "./simple_runner";
import TestRunner "./hhdao.test";

// Single top-level persistent actor — moc requires only one actor or actor class
persistent actor HHDAO_Test_Entry {
  public query func run() : async Text {
    TestUtils.printTestHeader("Combined HHDAO Test Runner");

    // run lightweight quick tests
    let r1 = QuickTest.runBasicTest();
    QuickTestActor.runBasicTest();

    // run the modular test runner
    TestRunner.runTests();

    // example: run simple runner test
    SimpleTestRunner.run();

    r1
  };
};
