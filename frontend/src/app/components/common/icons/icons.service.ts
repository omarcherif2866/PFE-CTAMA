import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatherModule } from 'angular-feather';
import { 
    ChevronDown, Facebook, Twitter, Linkedin, Instagram, MapPin, Lock, Send, Play, Plus, Calendar,
    Mail, Server, Code, Users, GitBranch, Database, ArrowRight, ArrowLeft, Watch,
    Globe, File, TrendingUp, Folder, Monitor, Cloud, Layout, Smartphone, User, HardDrive, Heart, Link,
    PenTool, ShoppingCart, CheckCircle, Settings, Grid, Info, MousePointer, Bell, Gitlab, Search, ChevronRight, ChevronLeft, Phone, ArrowUp, Check, Airplay, PieChart, Target, PlusCircle, Star, PhoneCall, Clock, Minus, Trash2
} from 'angular-feather/icons';

const icons = {
    ChevronDown, Facebook, Twitter, Linkedin, Instagram, MapPin, Lock, Send, Play, Plus, Calendar,
    Mail, Server, Code, Users, GitBranch, Database, ArrowRight, ArrowLeft, HardDrive, Heart, Link,
    Globe, File, TrendingUp, Folder, Monitor, Cloud, Layout, Smartphone, Watch, User, Search,
    PenTool, ShoppingCart, CheckCircle, Settings, Grid, Info, MousePointer, Bell, Gitlab, ChevronRight, ChevronLeft, Phone, ArrowUp, Check, Airplay, PieChart, Target, PlusCircle, Star, PhoneCall, Clock, Minus, Trash2
};

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        FeatherModule.pick(icons)
    ],
    exports: [
        FeatherModule
    ]
})
export class IconsService { }