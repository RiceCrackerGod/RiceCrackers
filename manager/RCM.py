import os

def create_chapter_files():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    print(f"Script directory: {script_dir}")
    
    # Define the target directory (navigate up from manager to RiceCrackers, then into read/0zero)
    target_dir = os.path.join(script_dir, '../read/0zero')
    target_dir = os.path.abspath(target_dir)  # Resolve to absolute path
    print(f"Target directory: {target_dir}")
    
    # Create target directory if it doesn't exist
    os.makedirs(target_dir, exist_ok=True)
    
    # Define the source file path
    source_path = os.path.join(target_dir, 'chapter-0.html')
    
    file_exists = os.path.exists(source_path)
    print(f"Looking for: {source_path}")
    print(f"File exists: {file_exists}")
    
    if not file_exists:
        print("Error: chapter-0.html not found.")
        print("Files in target directory:")
        print(os.listdir(target_dir))
        print("Please ensure chapter-0.html is in the correct location.")
        return
    
    try:
        with open(source_path, 'r', encoding='utf-8') as source_file:
            template_content = source_file.read()
        
        for i in range(1, 1000):
            filename = os.path.join(target_dir, f'chapter-{i}.html')
            with open(filename, 'w', encoding='utf-8') as new_file:
                new_file.write(template_content)
            print(f'Created {filename}')
            
        print('All chapter files have been created successfully!')
        
    except Exception as e:
        print(f'An error occurred: {str(e)}')

if __name__ == '__main__':
    create_chapter_files()