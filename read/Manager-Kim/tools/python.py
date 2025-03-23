import os

def create_chapter_files():
    # Get the directory where the script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    print(f"Script directory: {script_dir}")
    
    # Look for chapter-0.html in the script's directory
    source_path = os.path.join(script_dir, 'chapter-0.html')
    file_exists = os.path.exists(source_path)
    print(f"Looking for: {source_path}")
    print(f"File exists: {file_exists}")
    
    if not file_exists:
        print("Error: chapter-0.html not found.")
        print("Files in script's directory:")
        print(os.listdir(script_dir))
        return
    
    try:
        # Read the content of chapter-0.html
        with open(source_path, 'r', encoding='utf-8') as source_file:
            template_content = source_file.read()
        
        # Create files from chapter-1.html to chapter-1000.html
        for i in range(1, 1000):  # Or change to 11 for 10 files
            filename = os.path.join(script_dir, f'chapter-{i}.html')
            with open(filename, 'w', encoding='utf-8') as new_file:
                new_file.write(template_content)
            print(f'Created {filename}')
            
        print('All chapters files have been created successfully!')
        
    except Exception as e:
        print(f'An error occurred: {str(e)}')

if __name__ == '__main__':
    create_chapter_files()