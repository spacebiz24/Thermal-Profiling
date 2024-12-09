import tkinter as tk
from PIL import Image, ImageTk
import matplotlib.pyplot as plt

class Data:
    data = []
    sensor = []
    avg = []
    image = []

    def run_data(self):
        f = open("data.txt")
        lines = f.readlines()
        for line in lines:
            self.data.append([float(x) for x in line.split(",") if x!='\n'])

        for i in range(len(self.data[0])):
            self.sensor.append([x[i] for x in self.data])

        for ele in self.data:
            self.avg.append(sum(ele[1:])/len(self.data[0]))

        for i in range(len(self.data[0])) :
            self.image.append("assets/Images/fig"+ str(i)+".png")
        self.image.append("assets/Images/comb.png")
        self.image.append("assets/Images/avg.png")

        for i in range(len(self.image)-2):
            plt.plot(self.sensor[0],self.sensor[i])
            plt.xlabel('Time (ms)')
            plt.ylabel('Temperature (K)')
            plt.savefig(self.image[i])
            plt.clf()
        
        for i in range(1,len(self.image)-2):
            plt.plot(self.sensor[0],self.sensor[i],color = "#"+str(100000 + i*10485),label = "Sensor "+str(i))
        plt.xlabel('Time (ms)')
        plt.ylabel('Temperature (K)')
        plt.legend()
        plt.savefig(self.image[len(self.image)-2])
        plt.clf()

        plt.plot(self.sensor[0],self.avg)
        plt.xlabel('Time (ms)')
        plt.ylabel('Temperature (K)')
        plt.savefig(self.image[len(self.image)-1])
        plt.clf()

class App:

    count = 8
    scale = 2

    #colors
    bg_color = "#F3F3F3"
    topBar_color = "#208686"
    sensor_btn_color = "#27294C"
    btn_color = "#721C1C"
    eject_btn_color = "#9C1B1B"
    developer_btn_color = "#30682F"

    #logos
    settings_logo : ImageTk.PhotoImage
    back_logo : ImageTk.PhotoImage

    #Images
    fig : ImageTk.PhotoImage
    avg : ImageTk.PhotoImage
    comb : ImageTk.PhotoImage

    #frames
    topBar : tk.Frame
    MainScreen : tk.Frame

    def create_assets():
        temp_root = tk.Tk()

        #images
        App.avg = ImageTk.PhotoImage(Image.open("assets/Images/avg.png").resize((472,240)))
        App.comb = ImageTk.PhotoImage(Image.open("assets/Images/comb.png").resize((472,240)))
        fig1 = ImageTk.PhotoImage(Image.open("assets/Images/fig1.png").resize((472,240)))
        fig2 = ImageTk.PhotoImage(Image.open("assets/Images/fig2.png").resize((472,240)))
        fig3 = ImageTk.PhotoImage(Image.open("assets/Images/fig3.png").resize((472,240)))
        fig4 = ImageTk.PhotoImage(Image.open("assets/Images/fig4.png").resize((472,240)))
        fig5 = ImageTk.PhotoImage(Image.open("assets/Images/fig5.png").resize((472,240)))
        fig6 = ImageTk.PhotoImage(Image.open("assets/Images/fig6.png").resize((472,240)))
        fig7 = ImageTk.PhotoImage(Image.open("assets/Images/fig7.png").resize((472,240)))
        fig8 = ImageTk.PhotoImage(Image.open("assets/Images/fig8.png").resize((472,240)))
        App.fig = [fig1,fig2,fig3,fig4,fig5,fig6,fig7,fig8]

        #logos
        App.settings_logo = ImageTk.PhotoImage(Image.open("assets/Settings.png").resize((40, 40)))
        App.back_logo = ImageTk.PhotoImage(Image.open("assets/Back.png").resize((40, 40)))
        
        #frames
        App.topBar = tk.Frame(root, bg=App.topBar_color, pady=16)
        App.MainScreen = tk.Frame(root, bg=App.bg_color)
        temp_root.destroy()

    def clear_widgets(frame):
        for widget in frame.winfo_children():
            widget.destroy()
    
    def loadTitle(root, title_text):
        App.topBar.grid(sticky="ew")
        label = tk.Label(App.topBar, text=title_text, bg=App.topBar_color, font=("Helvetica", 16, "bold"),fg="white")
        label.grid(sticky="n")

        if title_text == "Menu":
            btn = tk.Button(App.topBar, image=App.settings_logo, background=App.topBar_color,command=lambda:App.load_SettingScreen(root))
            btn.place(x=428,y=-8)
        else:
            btn = tk.Button(App.topBar, image=App.back_logo, background=App.topBar_color,command=lambda:App.load_MainScreen(root))
            btn.place(x=4,y=-8)

        root.grid_columnconfigure(0, weight=1)
        App.topBar.grid_columnconfigure(0, weight=1)

    def load_MainScreen(root):
        App.clear_widgets(App.MainScreen)
        App.clear_widgets(App.topBar)
        App.loadTitle(root,"Menu")
        App.MainScreen.grid(columnspan=App.count+2)
        App.MainScreen.tkraise()
        btn_combined = tk.Button(App.MainScreen,width=6*App.scale,height=2*App.scale,text="Comb",pady=8,bg=App.btn_color,fg="white",font=("Helvetica",8),command=lambda:App.load_CombinedScreen(root))
        btn_combined.grid(row=1,column=0)
        for i in range(App.count):
            App.sensorBtn(App.MainScreen,i)
        btn_avg = tk.Button(App.MainScreen,width=6*App.scale,height=2*App.scale,text="Avg",pady=8,bg=App.btn_color,fg="white",font=("Helvetica",8),command=lambda:App.load_AverageScreen(root))
        btn_avg.grid(row=1,column=5)
    
    def sensorBtn(root,index):
        btn = tk.Button(root, width=4*App.scale,height=2*App.scale,text="Sensor "+str(index+1),bg=App.sensor_btn_color,fg="white",font=("Helvetica",8),command = lambda:App.load_SensorScreen(root,index+1))
        btn.grid(row=(index//4)*2,column=(index%4)+1,pady=(8,8),padx=8)

    def load_SettingScreen(root):
        App.clear_widgets(App.MainScreen)
        App.clear_widgets(App.topBar)
        App.loadTitle(root,"Options")
        App.MainScreen.grid(rowspan=1,columnspan=2)
        btn_eject = tk.Button(App.MainScreen,width=12*App.scale,height=8*App.scale,text="Eject",bg=App.eject_btn_color,fg="white",font=("Helvetica",10,"bold"))
        btn_eject.grid(column=0,row=0)
        btn_dev = tk.Button(App.MainScreen,width=12*App.scale,height=8*App.scale,text="Dev Option",bg=App.developer_btn_color,fg="white",font=("Helvetica",10))
        btn_dev.grid(column=1,row=0)

    def load_AverageScreen(root):
        App.clear_widgets(App.MainScreen)
        App.clear_widgets(App.topBar)
        App.loadTitle(root,"Average")
        App.MainScreen.grid()
        label = tk.Label(App.MainScreen,image=App.avg)
        label.grid()


    def load_SensorScreen(root,index):
        App.clear_widgets(App.MainScreen)
        App.clear_widgets(App.topBar)
        App.loadTitle(root,"Sensor "+str(index))
        App.MainScreen.grid()
        label = tk.Label(App.MainScreen,image=App.fig[index-1])
        label.grid()

    def load_CombinedScreen(root):
        App.clear_widgets(App.MainScreen)
        App.clear_widgets(App.topBar)
        App.loadTitle(root,"Combined")
        App.MainScreen.grid()
        label = tk.Label(App.MainScreen,image=App.comb)
        label.grid()

if __name__ == "__main__":
    root = tk.Tk()
    Data.run_data(Data)
    App.create_assets()
    App.load_MainScreen(root)
    root.geometry("480x320")
    root.resizable(False,False)
    root.mainloop()


    