#include <iostream>
#include <random>
#include <vector>

using namespace std;

// Matriz global (simulando dados no backend)
vector<vector< int>> matriz;

// Inicializa a matriz
void inicializarMatriz(int linhas, int colunas) {
    matriz.resize(linhas, vector<int>(colunas));
    random_device rd;
    mt19937 gen(rd());
    uniform_int_distribution<int> dist(1, 99);

    for (int  i = 0; i < linhas; i++)
    {
        for (int j = 0; j < colunas; j++)
        {
            matriz[i][j] = dist(gen);
        }
    }
}

// Retorna valor da matriz
int getValor(int linha, int coluna) {
    if (linha < 0 || linha >= matriz.size() ||
        coluna < 0 || coluna >= matriz[0].size())
    {
        return -1;
    }

    return matriz[linha][coluna];
}

int main() {
    inicializarMatriz(5, 5);

    int linha, coluna;

    // Entrada simulando requisição
    cin >> linha >> coluna;

    int resultado = getValor(linha, coluna);

    // Saída simulando resposta
    cout << resultado << endl;

    return 0;
}