#pragma once
#include <iostream>
#include <string>
#include <vector>
#include <fstream>

using namespace std;

struct WebBuildTest_Answers{
    int expectedSource;
    int expectedBarleySink;
    int expectedSink;
    bool expectedIsBeerCreated;
    std::vector<vector<float>> expectedCapacity;
    std::vector<vector<float>> expectedFlowPassed;
    std::vector<vector<int>> expectedAdj;
};

class Test{
public:
    Test(){}
    Test(string name) : name(name){ number ++; }
    ~Test(){}
    virtual void Run() {};
    int errors=0;
    int number = 0;
    string name;
};

class TestGroup{
public:
    int errors = 0;
    int testNumber = 1;
    string name;
    vector<Test*> tests;

    TestGroup(string name) : name(name){
        cout<<"\n ********** ********** ********** ********** \n"
              " ========== Starts Testing "<< name <<" ========== \n"
              " ********** ********** ********** ********** " << endl;
    }
    ~TestGroup(){
        for(Test* t : tests)
            delete t;
    }

    virtual void LoadData(string fileName) {};

    void RunAllTests(){
        int i = 1;
        for(Test* t : tests){
            cout<< "\n ========== Starts "<< name << ": " << i << " ========== " << endl;

            t->Run();
            this->errors += t->errors;

            cout << " ========== Ends " << t->name << ": " << i << " ERRORS: " << t->errors << " ========== " << endl;
            i++;
            delete t;
        }
        tests.clear();

        cout << "\n";
        if(errors){
            cout << " ========== [X] TESTS NOT PASSED [X] ========== " << " Number of errors: " << errors << endl;
        }else{
            cout << " ========== [✓] ALL TESTS PASSED [✓] ========== " << endl;
        }
        cout<<" ********** ********** ********** ********** \n"
              " ========== Ends Testing "<< name <<" ========== \n"
              " ********** ********** ********** ********** \n"<<endl;
    }

    void addSingleTest(Test* test){
        tests.push_back(test);
    }
};