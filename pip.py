import random
import time
import matplotlib.pyplot as plt

def simular_irrigacao(duracao_segundos=30, intervalo=1):
    umidades = []
    irrigacoes = []
    tempos = []

    print("Iniciando simulação de irrigação inteligente...\n")
    umidade =  40  # Umidade inicial do solo
    for t in range(0, duracao_segundos, intervalo):
        acionar_irrigacao = umidade < 30

        print(f"Tempo {t}s - Umidade: {umidade:.1f}% - ", end="")
        if acionar_irrigacao:
          print("Solo seco. Iniciando irrigação.")
          umidade += 15  # Aumenta a umidade ao irrigar
          if umidade > 100:
            umidade = 100  # Limita a umidade máxima a 100%
        else:
          print("Solo úmido. Irrigação não necessária.")
        umidade -= random.uniform(0.5, 4.5)
        umidades.append(umidade)
        irrigacoes.append(1 if acionar_irrigacao else 0)
        tempos.append(t)

        time.sleep(intervalo)
    return tempos, umidades, irrigacoes

def exibir_grafico(tempos, umidades, irrigacoes):
    plt.figure(figsize=(10, 6))
    plt.plot(tempos, umidades, label="Umidade do Solo (%)", marker='o')
    plt.axhline(y=30, color='red', linestyle='--', label="Limite de Irrigação (30%)")
    plt.fill_between(tempos, 0, 100, where=[irrigacoes[i] == 1 for i in tempos],
                     color='blue', alpha=0.1, label="Irrigação Ativa")
    plt.title("Simulação de Irrigação Inteligente")
    plt.xlabel("Tempo (s)")
    plt.ylabel("Umidade (%)")
    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    tempos, umidades, irrigacoes = simular_irrigacao(10, 1)
    exibir_grafico(tempos, umidades, irrigacoes)
