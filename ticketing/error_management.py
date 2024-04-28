import tkinter as tk
from tkinter import messagebox
import mysql.connector
from mysql.connector import Error
import configparser
from tkinter import ttk 
from PIL import Image, ImageTk
import pyttsx3 



def load_db_config(filename='config.ini', section='mysql'):
    parser = configparser.ConfigParser()
    parser.read(filename)
    db_config = {}
    if parser.has_section(section):
        db_config = dict(parser.items(section))
    else:
        raise Exception(f'Section {section} not found in the {filename} file')
    return db_config

def connect():
    try:
        db_config = load_db_config()
        conn = mysql.connector.connect(**db_config)
        if conn.is_connected():
            print('Connected to MySQL database')
            return conn
    except Error as e:
        print(f'Error connecting to database: {str(e)}')
        raise

def authenticate(email, password):
    conn = connect()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM administrateurs WHERE email = %s AND mot_de_passe = %s", (email, password))
            admin = cursor.fetchone()
            if admin:
                return True, admin[0] 
        except Error as e:
            print(f'Error during authentication: {str(e)}')
        finally:
            conn.close()
    return False, None

def create_table_problems(conn):
    try:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS Problems (
                id INT AUTO_INCREMENT PRIMARY KEY,
                description VARCHAR(255) NOT NULL,
                solved BOOLEAN NOT NULL DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                resolved_at TIMESTAMP NULL,
                type ENUM('urgent', 'other') NOT NULL DEFAULT 'other',
                admin_id INT,
                FOREIGN KEY (admin_id) REFERENCES administrateurs(id),
                       
                created_by INT
            )
        """)
        print('Table Problems created successfully')
    except Error as e:
        print(f'Error creating Problems table: {str(e)}')

def display_unsolved_problems(admin_id):
    def mark_as_solved_and_refresh(problem_id):
        conn = connect()
        if conn:
            mark_as_solved(conn, problem_id)
            conn.close()
            display_unsolved_problems(admin_id)

    def change_assigned_admin(problem_id):
        def change_assigned_admin_action(problem_id, new_admin_email):
            if new_admin_email:
                try:
                    conn = connect()
                    if conn:
                        cursor = conn.cursor()
                        cursor.execute("SELECT id FROM administrateurs WHERE email = %s", (new_admin_email,))
                        new_admin_id = cursor.fetchone()[0]
                        cursor.execute("UPDATE Problems SET admin_id = %s WHERE id = %s", (new_admin_id, problem_id))
                        conn.commit()
                        conn.close()
                        messagebox.showinfo("Success", "Assigned admin updated successfully.")
                        display_unsolved_problems(admin_id) 
                except Error as e:
                    messagebox.showerror("Error", f"Failed to update assigned admin: {e}")
            else:
                messagebox.showerror("Error", "Please select a new admin.")

        window = tk.Toplevel()
        window.title("Change Assigned Admin")

        label_select_admin = tk.Label(window, text="Select new admin:")
        label_select_admin.grid(row=0, column=0, padx=10, pady=5)

        conn = connect()
        if conn:
            admins = get_admins(conn)
            new_admin_var = tk.StringVar()
            new_admin_var.set(admins[0][0]) 
            new_admin_menu = tk.OptionMenu(window, new_admin_var, *[admin[0] for admin in admins])
            new_admin_menu.grid(row=0, column=1, padx=10, pady=5)
            conn.close()

        change_button = tk.Button(window, text="Change", command=lambda: change_assigned_admin_action(problem_id, new_admin_var.get()))
        change_button.grid(row=1, column=0, columnspan=2, pady=10)

    conn = connect()
    if conn:
        create_table_problems(conn)
        cursor = conn.cursor()
        try:
            cursor.execute("""
                SELECT p.id, p.description, p.created_at, p.type, 
                       IF(a.id IS NOT NULL, 'Administrateur', 
                          IF(b.id IS NOT NULL, 'Beneficiaire', 
                             IF(c.id IS NOT NULL, 'Benevole', 'Unknown')
                          )
                       ) AS creator_type,
                       CASE 
                          WHEN a.id IS NOT NULL THEN CONCAT(a.nom, ' ', a.prenom)
                          WHEN b.id IS NOT NULL THEN CONCAT(b.nom, ' ', b.prenom)
                          WHEN c.id IS NOT NULL THEN CONCAT(c.nom, ' ', c.prenom)
                          ELSE 'Unknown'
                       END AS creator_name,
                       CASE 
                          WHEN a.id IS NOT NULL THEN a.email
                          WHEN b.id IS NOT NULL THEN b.email
                          WHEN c.id IS NOT NULL THEN c.email
                          ELSE ''
                       END AS creator_email,
                       IFNULL(ad.nom, 'Unassigned') AS assigned_to
                FROM Problems p 
                LEFT JOIN administrateurs a ON p.created_by = a.id 
                LEFT JOIN beneficiaires b ON p.created_by = b.id 
                LEFT JOIN benevoles c ON p.created_by = c.id 
                LEFT JOIN administrateurs ad ON p.admin_id = ad.id
                WHERE p.solved = FALSE
            """)
            unsolved_problems = cursor.fetchall()
        except Error as e:
            print(f"Error fetching unsolved problems: {e}")
        finally:
            cursor.close()
            conn.close()

        if unsolved_problems:
            window = tk.Tk()
            window.title("Unsolved Problems")

            title_label = tk.Label(window, text="Unsolved Problems", font=("Arial", 20, "bold"))
            title_label.grid(row=0, column=0, columnspan=7, pady=10)

            tk.Label(window, text="Description").grid(row=1, column=0)
            tk.Label(window, text="Creation Time").grid(row=1, column=1)
            tk.Label(window, text="Type").grid(row=1, column=2)
            tk.Label(window, text="Assigned To").grid(row=1, column=3)
            tk.Label(window, text="Created By").grid(row=1, column=4)
            tk.Label(window, text="Creator Email").grid(row=1, column=5)
            tk.Label(window, text="Change Assigned").grid(row=1, column=6)
            tk.Label(window, text="Mark as Solved").grid(row=1, column=7)

            for i, (problem_id, description, created_at, problem_type, creator_type, creator_name, creator_email, assigned_to) in enumerate(unsolved_problems):
                tk.Label(window, text=description, wraplength=250, justify="left").grid(row=i+2, column=0, padx=5, pady=5)
                tk.Label(window, text=created_at.strftime("%Y-%m-%d %H:%M:%S")).grid(row=i+2, column=1, padx=5, pady=5)
                tk.Label(window, text=problem_type).grid(row=i+2, column=2, padx=5, pady=5)
                tk.Label(window, text=assigned_to).grid(row=i+2, column=3, padx=5, pady=5)
                tk.Label(window, text=creator_name).grid(row=i+2, column=4, padx=5, pady=5)
                tk.Label(window, text=creator_email).grid(row=i+2, column=5, padx=5, pady=5)

                change_button = tk.Button(window, text="Change", command=lambda id=problem_id: change_assigned_admin(id))
                change_button.grid(row=i+2, column=6, padx=5, pady=5)

                solve_button = tk.Button(window, text="Mark as Solved", command=lambda id=problem_id: mark_as_solved_and_refresh(id))
                solve_button.grid(row=i+2, column=7, padx=5, pady=5)

            window.mainloop()
        else:
            messagebox.showinfo("No Problems", "No unsolved problems found.")



def display_solved_problems(admin_id):
    conn = connect()
    if conn:
        create_table_problems(conn)
        solved_problems = get_solved_problems(conn)
        conn.close()

        if solved_problems:
            window = tk.Tk()
            window.title("Solved Problems")

            title_label = tk.Label(window, text="Solved Problems", font=("Arial", 20, "bold"))
            title_label.grid(row=0, column=0, columnspan=6, pady=10)

            tk.Label(window, text="Description").grid(row=1, column=0)
            tk.Label(window, text="Creation Time").grid(row=1, column=1)
            tk.Label(window, text="Resolution Time").grid(row=1, column=2)
            tk.Label(window, text="Type").grid(row=1, column=3)
            tk.Label(window, text="Assigned To").grid(row=1, column=4)
            tk.Label(window, text="Created By").grid(row=1, column=5)

            for i, (problem_id, description, created_at, resolved_at, assigned_admin_id, created_by) in enumerate(solved_problems):
                tk.Label(window, text=description, wraplength=250, justify="left").grid(row=i+2, column=0, padx=5, pady=5)
                tk.Label(window, text=created_at.strftime("%Y-%m-%d %H:%M:%S")).grid(row=i+2, column=1, padx=5, pady=5)
                tk.Label(window, text=resolved_at.strftime("%Y-%m-%d %H:%M:%S")).grid(row=i+2, column=2, padx=5, pady=5)
                tk.Label(window, text="Other").grid(row=i+2, column=3, padx=5, pady=5)

                conn = connect()
                if conn:
                    try:
                        cursor = conn.cursor()
                        cursor.execute("SELECT nom, prenom FROM administrateurs WHERE id = %s", (assigned_admin_id,))
                        admin = cursor.fetchone()
                        assigned_to = f"{admin[0]} {admin[1]}" if admin else "Not Assigned"
                        tk.Label(window, text=assigned_to).grid(row=i+2, column=4, padx=5, pady=5)
                    except Error as e:
                        print(f'Error fetching assigned admin: {str(e)}')
                    finally:
                        conn.close()

                conn = connect()
                if conn:
                    try:
                        cursor = conn.cursor()
                        cursor.execute("SELECT id FROM beneficiaires WHERE id = %s", (created_by,))
                        if cursor.rowcount > 0:
                            cursor.execute("SELECT nom, prenom FROM beneficiaires WHERE id = %s", (created_by,))
                        else:
                            cursor.execute("SELECT nom, prenom FROM benevoles WHERE id = %s", (created_by,))

                        creator = cursor.fetchone()
                        if creator:
                            created_by_name = f"{creator[0]} {creator[1]}"
                        else:
                            created_by_name = "Unknown"
                        tk.Label(window, text=created_by_name).grid(row=i+2, column=5, padx=5, pady=5)
                    except Error as e:
                        print(f'Error fetching creator name: {str(e)}')
                    finally:
                        conn.close()

        else:
            messagebox.showinfo("No Problems", "No solved problems found.")

def mark_as_solved(conn, problem_id):
    try:
        cursor = conn.cursor()
        cursor.execute("UPDATE Problems SET solved = TRUE, resolved_at = NOW() WHERE id = %s", (problem_id,))
        conn.commit()
        print(f'Problem {problem_id} marked as solved')
    except mysql.connector.Error as e:
        print(f'Error marking problem as solved: {str(e)}')

def get_unsolved_problems(conn):
    unsolved_problems = []
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id, description, created_at, admin_id, created_by FROM Problems WHERE solved = FALSE")
        unsolved_problems = cursor.fetchall()
    except Error as e:
        print(f'Error fetching unsolved problems: {str(e)}')
    return unsolved_problems

def get_solved_problems(conn):
    solved_problems = []
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id, description, created_at, resolved_at, admin_id, created_by FROM Problems WHERE solved = TRUE")
        solved_problems = cursor.fetchall()
    except Error as e:
        print(f'Error fetching solved problems: {str(e)}')
    return solved_problems

def add_problem(conn, description, problem_type, admin_id, created_by):
    try:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO Problems (description, type, admin_id, created_by) VALUES (%s, %s, %s, %s)", (description, problem_type, admin_id, created_by))
        conn.commit()
        print(f'New problem added: {description}')
    except Error as e:
        print(f'Error adding new problem: {str(e)}')

def get_admins(conn):
    admins = []
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT email FROM administrateurs")
        admins = cursor.fetchall()
    except Error as e:
        print(f'Error fetching admins: {str(e)}')
    return admins

def display_admins_option_menu(window, admins, row):
    admin_var = tk.StringVar()
    admin_var.set(admins[0][0])  
    admin_menu = tk.OptionMenu(window, admin_var, *[admin[0] for admin in admins])
    admin_menu.grid(row=row, column=1, padx=10, pady=5)
    return admin_var

def add_problem_window(admin_id):
    def add_problem_to_db():
        description = entry_description.get()
        problem_type = type_var.get()
        admin_email = admin_var.get()
        if description:
            conn = connect()
            if conn:
                create_table_problems(conn)
                cursor = conn.cursor()
                cursor.execute("SELECT id FROM administrateurs WHERE email = %s", (admin_email,))
                admin_id_assigned = cursor.fetchone()[0]
                add_problem(conn, description, problem_type, admin_id_assigned, admin_id)
                conn.close()
                messagebox.showinfo("Success", "New problem added successfully.")
                window.destroy()
        else:
            messagebox.showerror("Error", "Please enter a description for the new problem.")

    window = tk.Tk()
    window.title("Add Problem")

    label_description = tk.Label(window, text="Problem Description:")
    label_description.grid(row=0, column=0, padx=10, pady=5)

    entry_description = tk.Entry(window, width=40)
    entry_description.grid(row=0, column=1, padx=10, pady=5)

    label_type = tk.Label(window, text="Problem Type:")
    label_type.grid(row=1, column=0, padx=10, pady=5)

    type_var = tk.StringVar()
    type_var.set("other")
    type_menu = tk.OptionMenu(window, type_var, "urgent", "other")
    type_menu.grid(row=1, column=1, padx=10, pady=5)

    label_admin = tk.Label(window, text="Assign to Admin:")
    label_admin.grid(row=2, column=0, padx=10, pady=5)

    conn = connect()
    if conn:
        admins = get_admins(conn)
        admin_var = display_admins_option_menu(window, admins, row=2)
        conn.close()

    add_button = tk.Button(window, text="Add Problem", command=add_problem_to_db)
    add_button.grid(row=3, column=0, columnspan=2, pady=10)

    window.mainloop()

def display_assigned_problems(admin_id):
    def mark_assigned_as_solved(problem_id):
        conn = connect()
        if conn:
            mark_as_solved(conn, problem_id) 
            conn.close()
            messagebox.showinfo("Success", "Assigned problem marked as solved.")
            display_assigned_problems(admin_id)

    conn = connect()
    if conn:
        cursor = conn.cursor()
        try:
            cursor.execute("""
                SELECT p.id, p.description, p.created_at, p.type, 
                    IF(a.id IS NOT NULL, 'Administrateur', 
                        IF(b.id IS NOT NULL, 'Beneficiaire', 
                            IF(c.id IS NOT NULL, 'Benevole', 'Unknown')
                        )
                    ) AS creator_type,
                    CASE 
                        WHEN a.id IS NOT NULL THEN CONCAT(a.nom, ' ', a.prenom)
                        WHEN b.id IS NOT NULL THEN CONCAT(b.nom, ' ', b.prenom)
                        WHEN c.id IS NOT NULL THEN CONCAT(c.nom, ' ', c.prenom)
                        ELSE 'Unknown'
                    END AS creator_name,
                    CASE 
                        WHEN a.id IS NOT NULL THEN a.email
                        WHEN b.id IS NOT NULL THEN b.email
                        WHEN c.id IS NOT NULL THEN c.email
                        ELSE ''
                    END AS creator_email
                FROM Problems p 
                LEFT JOIN administrateurs a ON p.created_by = a.id 
                LEFT JOIN beneficiaires b ON p.created_by = b.id 
                LEFT JOIN benevoles c ON p.created_by = c.id 
                WHERE (p.admin_id = %s) AND p.solved = FALSE
                    """, (admin_id,))
            
            assigned_problems = cursor.fetchall()
        except Error as e:
            print(f"Error fetching assigned problems: {e}")
        finally:
            cursor.close()
            conn.close()

    if assigned_problems:
        window = tk.Tk()
        window.title("Assigned Problems")

        title_label = tk.Label(window, text="Assigned Problems", font=("Arial", 20, "bold"))
        title_label.grid(row=0, column=0, columnspan=5, pady=10)

        tk.Label(window, text="Description").grid(row=1, column=0)
        tk.Label(window, text="Creation Time").grid(row=1, column=1)
        tk.Label(window, text="Type").grid(row=1, column=2)
        tk.Label(window, text="Creator Type").grid(row=1, column=3)
        tk.Label(window, text="Creator Name").grid(row=1, column=4)
        tk.Label(window, text="Creator Email").grid(row=1, column=5)

        for i, problem in enumerate(assigned_problems):
            tk.Label(window, text=problem[1], wraplength=250, justify="left").grid(row=i+2, column=0, padx=5, pady=5)
            tk.Label(window, text=problem[2].strftime("%Y-%m-%d %H:%M:%S")).grid(row=i+2, column=1, padx=5, pady=5)
            tk.Label(window, text=problem[3]).grid(row=i+2, column=2, padx=5, pady=5)
            tk.Label(window, text=problem[4]).grid(row=i+2, column=3, padx=5, pady=5)
            tk.Label(window, text=problem[5]).grid(row=i+2, column=4, padx=5, pady=5)
            tk.Label(window, text=problem[6]).grid(row=i+2, column=5, padx=5, pady=5)

            solve_button = tk.Button(window, text="Mark as Solved", command=lambda id=problem[0]: mark_assigned_as_solved(id))
            solve_button.grid(row=i+2, column=6, padx=5, pady=5)

        window.mainloop()

    else:
        messagebox.showinfo("Assigned Problems", "No assigned problems found.")


def main_window(admin_id):
    def logout():
        engine = pyttsx3.init()
        engine.say("Non ne partez pas!!! S'il vous plaît, ne PARTEZ PAS!!!")
        engine.runAndWait()
        confirm = messagebox.askyesno("Logout", "Are you sure you want to logout?")
        if confirm:
            window.destroy()
            login_window()

    def change_background():
        nonlocal current_bg_index
        current_bg_index = (current_bg_index + 1) % len(background_images)
        background_image = Image.open(background_images[current_bg_index])
        main_bg_image = ImageTk.PhotoImage(background_image)
        main_bg_label.config(image=main_bg_image)
        main_bg_label.image = main_bg_image  

    background_images = ["./mainbg.jpg", "./mainbg2.jpg", "./mainbg3.jpg","./mainbg4.jpg"]
    current_bg_index = 0 

    window = tk.Tk()
    window.title("Ticketing System")
    
    window.geometry("720x400")

    background_image = Image.open(background_images[current_bg_index])
    main_bg_image = ImageTk.PhotoImage(background_image)
    main_bg_label = tk.Label(window, image=main_bg_image)
    main_bg_label.place(x=0, y=0, relwidth=1, relheight=1)

    button_style = ttk.Style()
    button_style.configure("TButton", font=("Arial", 10))

    assigned_icon = Image.open("./assigned_icon.png")
    assigned_icon = assigned_icon.resize((40, 40))
    assigned_icon = ImageTk.PhotoImage(assigned_icon)
    button_assigned = ttk.Button(window, image=assigned_icon, compound="left", command=lambda: display_assigned_problems(admin_id))
    button_assigned.pack(side="bottom", anchor="se", padx=10, pady=10)

    logout_icon = Image.open("./logout_icon.png")
    logout_icon = logout_icon.resize((40, 40))
    logout_icon = ImageTk.PhotoImage(logout_icon)
    logout_button = ttk.Button(window, image=logout_icon, compound="left", command=logout)
    logout_button.pack(side="bottom", anchor="se", padx=10, pady=10)

    unsolved_icon = Image.open("./unsolved_icon.png")
    unsolved_icon = unsolved_icon.resize((40, 40))
    unsolved_icon = ImageTk.PhotoImage(unsolved_icon)
    button_unsolved = ttk.Button(window, image=unsolved_icon, compound="left", command=lambda: display_unsolved_problems(admin_id))
    button_unsolved.pack(side="top", anchor="w", padx=10, pady=5)

    solved_icon = Image.open("./solved_icon.png")
    solved_icon = solved_icon.resize((40, 40))
    solved_icon = ImageTk.PhotoImage(solved_icon)
    button_solved = ttk.Button(window, image=solved_icon, compound="left", command=lambda: display_solved_problems(admin_id))
    button_solved.pack(side="top", anchor="w", padx=10, pady=5)

    add_icon = Image.open("./add_icon.png")
    add_icon = add_icon.resize((40, 40))
    add_icon = ImageTk.PhotoImage(add_icon)
    button_add = ttk.Button(window, image=add_icon, compound="left", command=lambda: add_problem_window(admin_id))
    button_add.pack(side="top", anchor="w", padx=10, pady=5)

    change_bg_button = ttk.Button(window, text="Change Background", command=change_background)
    change_bg_button.pack(side="bottom", anchor="se", padx=10, pady=10)

    engine = pyttsx3.init()
    engine.say("Bienvenue dans le système de ticket.")
    engine.runAndWait()

    window.mainloop()



def login_window():
    def login():
        email = entry_email.get()
        password = entry_password.get()
        if email and password:
            success, admin_id = authenticate(email, password)
            if success:
                messagebox.showinfo("Success", "Login successful.")
                window.destroy()
                main_window(admin_id)
            else:
                messagebox.showerror("Error", "Invalid email or password.")
        else:
            messagebox.showerror("Error", "Please enter both email and password.")

    window = tk.Tk()
    window.title("Login")

    background_image = Image.open("./background-image.jpg")
    background_photo = ImageTk.PhotoImage(background_image)

    window_width = min(background_image.width, 800)
    window_height = min(background_image.height, 600)
    window.geometry(f"{window_width}x{window_height}")

    window.maxsize(background_image.width, background_image.height)

    background_label = tk.Label(window, image=background_photo)
    background_label.place(x=0, y=0, relwidth=1, relheight=1)

    login_frame = tk.Frame(window, bg="white")
    login_frame.place(relx=0.5, rely=0.5, anchor="center")

    label_email = tk.Label(login_frame, text="Email:")
    label_email.grid(row=0, column=0, padx=10, pady=5, sticky="e")

    entry_email = tk.Entry(login_frame)
    entry_email.grid(row=0, column=1, padx=10, pady=5)

    label_password = tk.Label(login_frame, text="Password:")
    label_password.grid(row=1, column=0, padx=10, pady=5, sticky="e")

    entry_password = tk.Entry(login_frame, show="*")
    entry_password.grid(row=1, column=1, padx=10, pady=5)

    login_button = tk.Button(login_frame, text="Login", command=login)
    login_button.grid(row=2, column=0, columnspan=2, pady=10)

    window.mainloop()



if __name__ == "__main__":
    login_window()
