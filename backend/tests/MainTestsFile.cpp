#include "./headers/WebBuildTestsGroup.hpp"
#include "./headers/MaxFlowTestsGroup.hpp"

using namespace std;

int main(){
    cout<<"  _____ _____ _____ _____ _____ \n"
          "|_   _|  ___/  ___|_   _/  ___|\n"
          "  | | | |__ \\ `--.  | | \\ `--. \n"
          "  | | |  __| `--. \\ | |  `--. \\\n"
          "  | | | |___/\\__/ / | | /\\__/ /\n"
          "  \\_/ \\____/\\____/  \\_/ \\____/ "<<endl;

    //Testing building web
    WebBuildTestsGroup webBuildTestsGroup = WebBuildTestsGroup("WebBuildTests");
    webBuildTestsGroup.LoadData("web-build-test.txt");
    webBuildTestsGroup.RunAllTests();

    //Testing max flow in web
    MaxFlowTestGroup maxFlowTestGroup = MaxFlowTestGroup("MaxFlowTests");
    maxFlowTestGroup.LoadData("max-flow-test.txt");
    maxFlowTestGroup.RunAllTests();

    return 0;
}