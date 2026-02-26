from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()
        
        # 1. Home Page - SkillsCloud
        page.goto('http://localhost:5174/')
        page.wait_for_timeout(2000) # Wait for animation
        page.screenshot(path='home_skills.png')
        print("Captured home_skills.png")

        # 2. Sidebar & Navigation
        # Sidebar is visible on desktop
        page.screenshot(path='sidebar.png', full_page=True)
        print("Captured sidebar.png")

        # 3. Projects Page & Slant
        page.goto('http://localhost:5174/projects')
        page.click('text=Ver detalles') # Click first project
        page.wait_for_timeout(1000)
        page.screenshot(path='projects_preview.png')
        print("Captured projects_preview.png")

        # 4. CyberLab
        page.goto('http://localhost:5174/cyberlab')
        page.wait_for_timeout(1000)
        page.screenshot(path='cyberlab.png')
        print("Captured cyberlab.png")
        
        # Click a tool
        page.click('text=Encriptar / Desencriptar')
        page.wait_for_timeout(500)
        page.screenshot(path='cyberlab_tool.png')
        print("Captured cyberlab_tool.png")

        # 5. Playground Menu
        # Need to open playground - it's a modal
        page.goto('http://localhost:5174/')
        page.click('text=ABRIR PLAYGROUND')
        page.wait_for_timeout(500)
        page.screenshot(path='playground_menu.png')
        print("Captured playground_menu.png")

        # 6. Blog Mobile View
        mobile_context = browser.new_context(viewport={'width': 375, 'height': 667}, user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1')
        mobile_page = mobile_context.new_page()
        mobile_page.goto('http://localhost:5174/blog')
        mobile_page.wait_for_timeout(1000)
        mobile_page.screenshot(path='blog_mobile_list.png')
        print("Captured blog_mobile_list.png")
        
        browser.close()

if __name__ == '__main__':
    run_verification()
