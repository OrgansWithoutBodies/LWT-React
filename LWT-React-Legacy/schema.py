path = "/home/v/Downloads/lwt-backup-2023-02-20-00-40-58.sql"
tables = []
with open(path, 'r') as file:
    for line in file:
        if (line.startswith('CREATE TABLE')):
            tables.append(line)
textStr=''.join(tables)
with open('schema.sql','w') as file:
    file.write(textStr)