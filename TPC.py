import json, os, shutil

def open_json(filename):
    with open(filename, encoding="utf-8") as f:
        return json.load(f)

def mk_dir(relative_path):
    if os.path.exists(relative_path):
        shutil.rmtree(relative_path)
    os.makedirs(relative_path)

def new_file(filename, content):
    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)

# Carregamento e Preparação de Dados ---------------------------------------
data = open_json("reparacoes.json")
reparacoes = data["reparacoes"]

# Dicionários para organizar os dados para as páginas secundárias
intervencoes_dict = {}
marcas_modelos_dict = {}

for idx, r in enumerate(reparacoes):
    # Id único para cada reparação
    r_id = f"rep_{idx}"
    r["id"] = r_id 
    
    for i in r["intervencoes"]:
        cod = i["codigo"]
        if cod not in intervencoes_dict:
            intervencoes_dict[cod] = {
                "nome": i["nome"],
                "descricao": i["descricao"],
                "reps": []
            }
        intervencoes_dict[cod]["reps"].append(r)

    m_key = f"{r['viatura']['marca']}-{r['viatura']['modelo']}"
    if m_key not in marcas_modelos_dict:
        marcas_modelos_dict[m_key] = {
            "marca": r['viatura']['marca'],
            "modelo": r['viatura']['modelo'],
            "reps": []
        }
    marcas_modelos_dict[m_key]["reps"].append(r)

mk_dir("output")
mk_dir("output/reparacoes")
mk_dir("output/intervencoes")
mk_dir("output/modelos")

# Página Principal ----------------------------------
index_html = f'''
<html>
<head><title>Oficina Auto</title><meta charset='utf-8'/></head>
<body>
    <h1>Oficina: Sistema de Exploração</h1>
    <ul>
        <li><a href="lista_reparacoes.html">Listagem de Reparações</a></li>
        <li><a href="lista_intervencoes.html">Tipos de Intervenção</a></li>
        <li><a href="lista_modelos.html">Marcas e Modelos</a></li>
    </ul>
</body>
</html>
'''
new_file("output/index.html", index_html)

# Listagens -----------------------------

list_rep_content = "<h2>Listagem de Reparações</h2><table border='1'><tr><th>Data</th><th>NIF</th><th>Nome</th><th>Viatura</th><th>Intervenções</th><th>Detalhes</th></tr>"
for r in reparacoes:
    list_rep_content += f"<tr><td>{r['data']}</td><td>{r['nif']}</td><td>{r['nome']}</td><td>{r['viatura']['marca']} {r['viatura']['modelo']}</td><td>{r['nr_intervencoes']}</td><td><a href='reparacoes/{r['id']}.html'>Ver</a></td></tr>"
list_rep_content += "</table><p><a href='index.html'>Voltar</a></p>"
new_file("output/lista_reparacoes.html", list_rep_content)

# Lista de Intervenções (Alfabética)
list_int_content = "<h2>Tipos de Intervenção</h2><ul>"
for cod in sorted(intervencoes_dict.keys()):
    intv = intervencoes_dict[cod]
    list_int_content += f"<li><a href='intervencoes/{cod}.html'>{cod} - {intv['nome']}</a></li>"
list_int_content += "</ul><p><a href='index.html'>Voltar</a></p>"
new_file("output/lista_intervencoes.html", list_int_content)

# Lista de Marcas/Modelos ---
list_mod_content = "<h2>Marcas e Modelos Intervencionados</h2><ul>"
for m_key in sorted(marcas_modelos_dict.keys()):
    m = marcas_modelos_dict[m_key]
    list_mod_content += f"<li><a href='modelos/{m_key}.html'>{m['marca']} {m['modelo']}</a> ({len(m['reps'])} veículos)</li>"
list_mod_content += "</ul><p><a href='index.html'>Voltar</a></p>"
new_file("output/lista_modelos.html", list_mod_content)

# Páginas Individuais ------------------------------------------------------

# Páginas de Reparação
for r in reparacoes:
    li_intervencoes = "".join([f"<li>{i['nome']} ({i['codigo']})</li>" for i in r["intervencoes"]])
    html = f"<html><body><h1>Reparação {r['id']}</h1><p><b>Cliente:</b> {r['nome']} ({r['nif']})</p><p><b>Data:</b> {r['data']}</p><p><b>Viatura:</b> {r['viatura']['marca']} {r['viatura']['modelo']} ({r['viatura']['matricula']})</p><h3>Intervenções:</h3><ul>{li_intervencoes}</ul><a href='../lista_reparacoes.html'>Voltar</a></body></html>"
    new_file(f"output/reparacoes/{r['id']}.html", html)

# Páginas de Intervenção
for cod, info in intervencoes_dict.items():
    li_reps = "".join([f"<li><a href='../reparacoes/{r['id']}.html'>{r['data']} - {r['nome']}</a></li>" for r in info["reps"]])
    html = f"<html><body><h1>{info['nome']}</h1><p><b>Código:</b> {cod}</p><p><b>Descrição:</b> {info['descricao']}</p><h3>Reparações onde foi realizada:</h3><ul>{li_reps}</ul><a href='../lista_intervencoes.html'>Voltar</a></body></html>"
    new_file(f"output/intervencoes/{cod}.html", html)

# Páginas de Marca/Modelo
for m_key, info in marcas_modelos_dict.items():
    li_reps = "".join([f"<li><a href='../reparacoes/{r['id']}.html'>{r['data']} - {r['nome']} ({r['viatura']['matricula']})</a></li>" for r in info["reps"]])
    html = f"<html><body><h1>{info['marca']} {info['modelo']}</h1><h3>Histórico de Intervenções:</h3><ul>{li_reps}</ul><a href='../lista_modelos.html'>Voltar</a></body></html>"
    new_file(f"output/modelos/{m_key}.html", html)

print("Website gerado com sucesso")