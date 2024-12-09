import tkinter as tk
from PIL import Image, ImageTk
import matplotlib.pyplot as plt
import keyboard
import subprocess

class Data:
    data = []
    sensor = []
    avg = []
    image = []

    def run_data(self):
        # read data from file
        f = open("data.txt")
        lines = f.readlines()
        for line in lines:
            self.data.append([float(x) for x in line.split(",") if x!='\n'])

        # process data
        for i in range(len(self.data[0])):
            self.sensor.append([x[i] for x in self.data])

        for ele in self.data:
            self.avg.append(sum(ele[1:])/len(self.data[0]))

        # Generate image paths
        for i in range(len(self.data[0])) :
            self.image.append("assets/Images/fig"+ str(i)+".png")
        self.image.append("assets/Images/comb.png")
        self.image.append("assets/Images/avg.png")

        # Plot and save images
        for i in range(len(self.image)-2):
            plt.plot(self.sensor[0],self.sensor[i])
            plt.xlabel('Time (ms)')
            plt.ylabel('Temperature (K)')
            plt.savefig(self.image[i], bbox_inches='tight', pad_inches=0.1)  
            plt.clf()
        
        for i in range(1,len(self.image)-2):
            plt.plot(self.sensor[0],self.sensor[i],color = "#"+str(100000 + i*10485),label = "Sensor "+str(i))
        plt.xlabel('Time (ms)')
        plt.ylabel('Temperature (K)')
        plt.legend()
        plt.savefig(self.image[len(self.image)-2], bbox_inches='tight', pad_inches=0.1)  
        plt.clf()

        plt.plot(self.sensor[0],self.avg)
        plt.xlabel('Time (ms)')
        plt.ylabel('Temperature (K)')
        plt.savefig(self.image[len(self.image)-1], bbox_inches='tight', pad_inches=0.1)  
        plt.clf()

class App:

    count = 8
    scale = 1   # size

    # colors
    bg_color = "#DBD7D2"
    topBar_color = "#076672"
    sensor_btn_color = "#011638"
    btn_color = "#C75000"
    eject_btn_color = "#9C1B1B"
    developer_btn_color = "#138808"


    # logos
    settings_logo : ImageTk.PhotoImage
    back_logo : ImageTk.PhotoImage

    # Images
    fig : ImageTk.PhotoImage
    avg : ImageTk.PhotoImage
    comb : ImageTk.PhotoImage

    # frames
    topBar : tk.Frame
    MainScreen : tk.Frame

    def create_assets():
        # Load images
        App.avg = ImageTk.PhotoImage(Image.open("assets/Images/avg.png").resize((700, 400)))  
        App.comb = ImageTk.PhotoImage(Image.open("assets/Images/comb.png").resize((700, 400)))  
        fig1 = ImageTk.PhotoImage(Image.open("assets/Images/fig1.png").resize((700, 400)))  
        fig2 = ImageTk.PhotoImage(Image.open("assets/Images/fig2.png").resize((700, 400)))  
        fig3 = ImageTk.PhotoImage(Image.open("assets/Images/fig3.png").resize((700, 400)))  
        fig4 = ImageTk.PhotoImage(Image.open("assets/Images/fig4.png").resize((700, 400)))  
        fig5 = ImageTk.PhotoImage(Image.open("assets/Images/fig5.png").resize((700, 400)))  
        fig6 = ImageTk.PhotoImage(Image.open("assets/Images/fig6.png").resize((700, 400)))  
        fig7 = ImageTk.PhotoImage(Image.open("assets/Images/fig7.png").resize((700, 400)))  
        fig8 = ImageTk.PhotoImage(Image.open("assets/Images/fig8.png").resize((700, 400)))  
        App.fig = [fig1,fig2,fig3,fig4,fig5,fig6,fig7,fig8]

        # Load logos
        App.settings_logo = ImageTk.PhotoImage(Image.open("assets/Settings.png").resize((20, 20)))  
        App.back_logo = ImageTk.PhotoImage(Image.open("assets/Back.png").resize((20, 20)))  

        # Create frames
        App.topBar = tk.Frame(root, bg=App.topBar_color, pady=8)  
        App.MainScreen = tk.Frame(root, bg=App.bg_color)
        
    def clear_widgets(frame):
        # Clear all widgets from a frame
        for widget in frame.winfo_children():
            widget.destroy()
    
    def loadTitle(root, title_text):
        # Load title bar
        App.topBar.grid(sticky="ew")
        label = tk.Label(App.topBar, text=title_text, bg=App.topBar_color, font=("Helvetica", 12, "bold"),fg="white")  
        label.grid(sticky="ew")

        if title_text == "Menu":
            btn = tk.Button(App.topBar, image=App.settings_logo, background=App.topBar_color,command=lambda:App.load_SettingScreen(root))
            btn.place(x=700, y=-4)  
            btn.grid(sticky="ew")

        else:
            btn = tk.Button(App.topBar, image=App.back_logo, background=App.topBar_color,command=lambda:App.load_MainScreen(root))
            btn.place(x=4, y=-4) 
            btn.grid(sticky="ew")


        root.grid_columnconfigure(0, weight=1)
        App.topBar.grid_columnconfigure(0, weight=1)

    def load_MainScreen(root):
        # Load main screen
        App.clear_widgets(App.MainScreen)
        App.clear_widgets(App.topBar)
        App.loadTitle(root,"Menu")
        App.MainScreen.grid(columnspan=App.count+2)
        App.MainScreen.tkraise()
        #change button size
        # btn_combined = tk.Button(App.MainScreen,width=11*App.scale,height=3*App.scale,text="Comb",pady=4,bg=App.btn_color,fg="white",font=("Helvetica",8),command=lambda:App.load_CombinedScreen(root))
        btn_combined = tk.Button(App.MainScreen,width=14*App.scale,height=6*App.scale,text="COMBINED",pady=10,bg=App.btn_color,fg="white",font=("Helvetica",12),command=lambda:App.load_CombinedScreen(root))

        btn_combined.grid(row=1,column=0)  
        for i in range(App.count):
            App.sensorBtn(App.MainScreen,i)
        btn_avg = tk.Button(App.MainScreen,width=14*App.scale,height=6*App.scale,text="AVERAGE",pady=10,bg=App.btn_color,fg="white",font=("Helvetica",12),command=lambda:App.load_AverageScreen(root))
        btn_avg.grid(row=1,column=5)  
    
    def sensorBtn(root,index):
        # Load Sensor buttons
        #change button size
        # btn = tk.Button(root, width=6*App.scale,height=3*App.scale,text="Sensor "+str(index+1),bg=App.sensor_btn_color,fg="white",font=("Helvetica",8),command = lambda:App.load_SensorScreen(root,index+1))
        btn = tk.Button(root, width=8*App.scale, height=6*App.scale, text="SENSOR "+str(index+1), bg=App.sensor_btn_color, fg="white", font=("Helvetica",11), command=lambda:App.load_SensorScreen(root,index+1))

        btn.grid(row=(index//4)*2+2,column=(index%4)+1,padx=5, pady=(8, 11), sticky="ew")  #sticky="ns")

    def load_SettingScreen(root):
        # Load setting screen
        App.clear_widgets(App.MainScreen)
        App.clear_widgets(App.topBar)
        App.loadTitle(root,"Options")
        App.MainScreen.grid(rowspan=1,columnspan=2)
        btn_eject = tk.Button(App.MainScreen,width=17*App.scale,height=6*App.scale,text="EJECT",pady=13,bg=App.eject_btn_color,fg="white",font=("Helvetica",13,"bold"), command=eject_drive)
        btn_eject.grid(column=0,row=0,padx=(10, 5), pady=(10, 5))  
        btn_dev = tk.Button(App.MainScreen,width=17*App.scale,height=6*App.scale,text="DEV OPTION",pady=13,bg=App.developer_btn_color,fg="white",font=("Helvetica",12), command=exit_fullscreen)
        btn_dev.grid(column=1,row=0,padx=(5, 10), pady=(10, 5))  

    def load_AverageScreen(root):
        # Load average screen
        App.clear_widgets(App.MainScreen)
        App.clear_widgets(App.topBar)
        App.loadTitle(root,"Average")
        App.MainScreen.grid()
        label = tk.Label(App.MainScreen,image=App.avg)
        label.grid(sticky="ew")

    def load_SensorScreen(root,index):
        # Load sensor screen
        App.clear_widgets(App.MainScreen)
        App.clear_widgets(App.topBar)
        App.loadTitle(root,"Sensor "+str(index))
        App.MainScreen.grid()
        label = tk.Label(App.MainScreen,image=App.fig[index-1])
        label.grid(sticky="ew")

    def load_CombinedScreen(root):
        # Load combined screen
        App.clear_widgets(App.MainScreen)
        App.clear_widgets(App.topBar)
        App.loadTitle(root,"Combined")
        App.MainScreen.grid()
        label = tk.Label(App.MainScreen,image=App.comb)
        label.grid()

def eject_drive():
    try:
        subprocess.call("sudo eject /dev/sda1", shell=True)
        #subprocess.run(['/usr/bin/eject', '/dev/sda1'])  
        print("Bye says the drive")
    except Exception as e:
        #subprocess.run(['eject'])
        print("There are no connected drives")

# Function to exit fullscreen mode and resize window
def exit_fullscreen():
    root.attributes('-fullscreen', False)  
    root.geometry("800x480")  

if __name__ == "__main__":
    # Initialize root window
    root = tk.Tk()

    # Run data processing
    Data.run_data(Data)
    # Create assets and load main screen
    App.create_assets()
    App.load_MainScreen(root)
    
    # Allow window resizing in both directions
    root.resizable(True, True) 
    root.minsize(700, 330) 
    root.config(background="#DBD7D2")
    root.title("Sensor Data")
    #800 x 480 : screen resolution for the raspberry pi

    # Configure fullscreen mode
    root.attributes('-fullscreen', True)
    root.bind('<Escape>', exit_fullscreen) # Bind Esc key to exit fullscreen
    root.mainloop()
