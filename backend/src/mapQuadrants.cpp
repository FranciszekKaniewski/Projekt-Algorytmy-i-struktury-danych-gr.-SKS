#include <iostream>
#include <vector>
#include <initializer_list>
#include <cmath>
#include "./headers/mapQuadrants.hpp"

using namespace std;

MapQuadrants::MapQuadrants(vector<Vertex*> allVertices, vector<pair<vector<Point>, float>> points) {
    for (auto& pair : points) {
        quadrants.push_back(new Quadrant(pair.first, pair.second));
    }

    for (auto& v : allVertices) {
        if (auto f = dynamic_cast<Field*>(v)) {
            for (size_t i = 0; i < quadrants.size(); ++i) {
                if (quadrants[i]->isInside(f)) {
                    f->production = quadrants[i]->assignedProduction;
                    cout << f->id << " Nalezy do " << (i + 1) << " cwiartki, nadano produkcję: " << f->production << endl;
                    break;
                }
            }
        }
    }
}

int MapQuadrants::getQuadrantOfField(Field *f) {
    int i = 0;
    for(Quadrant* q : quadrants){
        if(q->isInside(f)) return i;
        i++;
    }
    return -1;
}

Quadrant::Quadrant(const vector<Point>& numbers, float production){
    points = numbers;
    assignedProduction = production;
};

bool Quadrant::isInside(Field* f){
    constexpr double EPS = 1e-9;
    int n = points.size();
    if(n < 3){
        return false;
    }

    double px = f->location.x;
    double py = f->location.y;

    bool has_negative = false;
    bool has_positive = false;

    for(int i = 0; i < n; ++i){
        Point a = points[i];
        Point b = points[(i + 1) % n];

        double cross = (b.x - a.x) * (py - a.y) - (b.y - a.y) * (px - a.x);

        if(fabs(cross) < EPS){
            double dotproduct = (px - a.x) * (b.x - a.x) + (py - a.y) * (b.y - a.y);
            double squaredlength = (b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y);
            if(dotproduct >= -EPS && dotproduct <= squaredlength + EPS){
                return true;
            }
        }

        if(cross < -EPS){
            has_negative = true;
        }else if(cross > EPS){
            has_positive = true;
        }

        if(has_negative && has_positive){
            return false;
        }
    }

    return true;
}




