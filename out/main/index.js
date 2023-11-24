"use strict";
const electron = require("electron");
const icon = "data:image/png;base64,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hAu4b/U5Xn7A/X4/kUiEu+66i46OjlpvUBXbtm3j05/+NJlMpiC+iyetxeQ3DINgMMiVV17J7/3e712U+2/fvp1EIsHPfvYzLMvCsix8Ph/hcJht27bxkY98pOqALF++nK9+9auFQZBIAoEAdXV1fOKPPkFLS8uC+nTn2jvpvqeb48pxRhpHuP+W+7l01aUX8pgXFdu3b2dycpLnn3++MGblBEYFVCdeXtrouk44HGb58uVYlsX73ve+C36Az3zmM+zYsYM1a9Zw7tw5kslkPnarrNTLfwHWrVsHwL333su999676Pu/973vZe/evaxdu5YXXniBdDoNgN/vJxQKcc011yCE4Lvf/S4//vGP51wvhOA73/kOa9euZenSpaRSKUzLxHEdfH4fTS1NtLS0EI/H+fCHP1xTnz7+8Y+zc+dOupu7OZc4R0zEWNG+AoAPfvCDpFIV86Rfc7z//e/ntttuY926dbz00ksLnmPnz615VZtfXOQn5hcy4Hm8//3vZ8eOHWia5q3+KnxjZi9yAA4fPnxB/di+fTt79+4tLFLy7U7HjrFp0yYAvv71r3Po0KGybdx55528613vYseOHfSf7yeTy2A6FopPQQvogDelqLWfd9xxBzt37kQVM1kJivAWNT/84Q+ZnJxc9PNeDFx55ZXcdttthfdVvOpfiKpVqp8zfeb0HOi1QHHb8317iudPr9WKLi/Z/X4/q1atIhqN0tfXx0svvTTvNfv27QOgq6sLn9+HETBQ/AquD+KheRPpq+LqznU0hyKLvv61Rl4TLtK8U13VFq9As9ks6XSaQCDAxMREyXnvfve7eeyxx+Ztx+/3MzAwUHIsHA4DMDExgWVZJSvacsZlx3EwTZNYzMsP/vSnP81dd90FwOjoKBs3bqz45fD5fPT09BAMBgEvFwBgcnKysDLLm4y6u70SMfv27atI9AceeADbtlm9ejV19XXEc1MI28TyS570P0XGztDS0lLyvp5//nne+ta3AvCmN72JH/zgB4XPQqGQ11fD4be2XcPLQ2fL3vcrX/kKbW2VK4r84z/+I88880zFc772ta/NWSjOxj333MNTTz1VcqyaoKiC2omXy+VIJBJ873vf4z3vec+czuq6XrEdIcSca1zX5amnnuLIkSNks9mZyfmsUlpCiJKl/BNPPMH27dtZv359gTwNDQ1cfvnl7N+/f94+5HI5Dhw4wJ49ewrHTpw4wbPPPksul0NKWbARdnV1AZ56q4SJiQmeeuopbrjhBrZ0b2Ho56NgZxlqGqVP7eETT3+CP7/mL0qe/Yknnij8ffvtt5d85kqX58cf4VzqBIoQbGvvxK/Nfbd33nkn69evr9i3n//851WJ9773vY/ly5dXPOfgwYNziHeBqEy8/KDniTc1NcXDDz/MgQMHWLJkCZFIhD179rBy5cqa72iaJt/85jdJpVIMDw8zNjbG5OQk6XS6QLxy/XBdF9M0SafTDA0N8bWvfY3W1lYaGhrYvXs3l19+OXv27KlIPPAk2J49ezh79iz33nsvAwMDxGIxTNOrL6jrOu3t7bS3tzMxMcHTTz9d9Zn27dvHDTfcQPeWbh5/9Wdg++ltOgXA/zjyIAf7P0u9L8u/7Gkg6hMlZL7tttsA+O9H/o6kux/LNbGlVdJ+JXvdl/d/mcnMJKv0VSwXy9GlztZVW+loX5jl4YknniCTyRQM4Lqus2nTpnktGBfoPald4pmmSTKZLLFeNzU1sdAAA4CxsTHGx8eZmJggHo+TTCbLmlKK+5C3GRUbmvMG6EOHDnH55Zezd+9ePvvZz1a89/33349t2yxdupRcLkcmkyGbzeI4TsFTsXXrVmBGjVbDvn37+Ou//ms2rNtIoL6eSTFASp9EIcj6yCOAn446lahPcOrUKY4ePQp4i5tLLrmE4ZTLvx68k9VtfjpbH1zQu7z35L2cjp8GYKW+kht9u2lval8w8V566SWGhobIZrOoqko4HKalpaUq8Rbrq626uMgPet5NkkqlmJycJB6Pk0qlFrzgkFKSTqeZmpoiHo+TSCQKFv9KC4diy3k6nSYejzMxMUEsFuPo0aOkUik2btxYVf2Mj4/zzDPPoGkanZ2dJTaoPPG2bPECsvMLh2ro6+vj0KFDBPx+Nq3vpi90HFBYH3kUVXhq9PoOA6BkPpdX+U/3m0gpODW0hxdOfYLFRqn1Wr38c/pfmBJTC742k8kU3mleIMz2X89Gsf+2VkwTtrZVbbHEyRMwl8thmuaiVrr56zOZTMFPmrd+V+tDnnx5V1UqlSKRSBSkyDve8Y6q988TauPGjSU+aJ/PR2NjIytXriSbzfLwww/X/Ez5Nteu6yQmzrMudD+GmJEW100T7/777y8cyxPvqXMzZYQn02t58vBfksiumHn26eC8N73pTdx4443ceOONhUXIimhTST9Sbopep7fmfueRzWZJpVIkk0mmpqZIJBIFab9hw4bCfTs7OwEKfur8nHyBks9dkDlldjRHtW/EvHctim5YSIRDmVKoBVWZN3kULxzmQ54kGzZswOfzEQgE8Pv9BAIBtm7diqIoPPbYYySTSYCaPA/5Nrd2rqPT/7cE1K2Fz1bWq6yoUxkeHubZZ58FoLOzk23btpGyJC8Ol87pbCfAcyc/S9/ILQAMZs4AcN999/HII4/wyCOPsHz5clL2FJevaOemNVvQlQurClxsuchkMqRSKc6c8e579913F+777ne/G4DTp0+XeC0WiNrCokquKBKvi7WpXaw28pEluVyOV199Fcuy2LVrF0uWLGFoaGjea3t6enj11Vfp6upiw4YNHDp0CF3XCQaDBTVbvAD46Ec/yj//8z9z8uTJeds8dOgQZ86c4ZJLLmFn++0cG5+ZG+al3b59+wqDtHfvXgBsCVd3GDzZN6t4+rTqHY13E9H/nt1t76bBaC18nHaSPD3yQxxps2VJB8vqGnjg+IuMphZnOyyeNzuOg6IoPPTQQ4TDYTZs2FAIQbMsi+eee67g6clrq3wbNcL9lQx5L3bS27ZNLpcjmUxy4sQJNm/ezG233ca3v/3tim388Ic/pKuri+7ubk6dOoXjOITDYdauXYvruvzoRz8qnLtnzx5SqRR/9Vd/VbHN+++/n7vuuotrlxslxLttjQ8onTPmJfOU5fLbWwKsa1T5f1/K4rilgxfPXMIDhz7HwOq/IuKfv651YzDMb269iifOHK3Yx0ooth7k/77nnnsIBAIFr05+jp1KpchkMmVNYJWwoDneLyPyLyYfD5fL5XjllVeAhanbzZs3E4lEqKurY/PmzRiGwf79+wsSc8WKFWzfvn1BbV6/wigcu26FQUdEJZlMFgzsjY2NXHvttUggaXkDduUyg6/dEKbBP9dMYTlBnjvxefpG31rx/pqicuPqLlbUN1U8bz4Uv9NMJkMikWB8fJzh4WGGhoYYHBxkeHiYiYkJpqamCrbX13SO98uIYlNPLpfj0KFDuK7LTTfdRCRS2d30wgsvcO7cOerr61m5ciWRSITNmzcDcyWTEIKrr766qqfgqaeeYmxsjNVRlY6IyrI6lbsv9xYBP/nJT8hmswAFX2fKkhQLuAa/wl/cWMeVy8sZ4wWnBm/nhZ6P41YZtnp/sOLn5SClLOSGuK6LZc/E3cXjcWKxGJOTk0xNTRXMX3k1u4ip0q+2xANKVrmxWIy+vj58Ph833VS5FIyUsrDC3LhxYyHWEErnd3lJpygKt956a8U2HcfhwQc9O9xNlxh84ZowEd2TYOXVbPkB+/C2IB/aFkAtY6OdTK3n6aN/STK3tGJfFoz8/j5MSz7HLflSZ7NZstlsgXB59+Zi5udCiF99iZdXDfmXsxh1u3r1ajo7OwkGg5w8eZLjx48DEI1Gue66meoeC2nzPZsC+FQI6QLLsgqELP5SJKz5V4NXLTf46u5IWdVrOyGeO/4Fzo9dX7U/tUIKL/mo8IPElW6JJaE44HORki4fYfSrK/HyKLbtmaZZCF/Kq7NKeOKJJ4jFYjQ1NbFhwwag1MB72223oes64+PjSCm56aabCvaz+fDQQw+RTqcJ64J6Q0EATz75ZCGwIT8NSFqS81PQG5OcGIP+OMwex0a/wn+9sY7t7XNVr0Th2MB7a1K9tUDqEmnMZL/lySeZa4G4CNFBv/oSD0rV7cDAAENDQ4UJfCVYlsVDDz0EUDCMllOJp3p6GBkZIRAI8Ja3vKVim+l0msceewwBtAaUeds8NuZyZkIylICJtKQ/LhkoYwlRgI9dGuSDWwOoZUZrMrWenx37czK5hUU5z8ZAZADLb2EHbBzD8dIwp8l3sVN6fyVU7ey0wtmYrW7zNj1YmGoEGB4eLgQZ+Hy+QuhSz+leTvf2LbhNVXj9y/9fUZRCUEBffK7UsJ35JcnVHQZfuj5CxDf3PZh2hGdPfIXBicpftEr4af1P6VvWhx22cMIOrm86/1eVSHHxyDc9jr+cxMsTbXY+a3G0azHynpD8RDjvxdi7d2/VKIoHHniAXC4HeHa4vDH0xhtvJBKJMDg0xMjEJMdOeo74WlT4/fffX/Dq5FfPQMG4PZWTTOaKw/ohYkB7XeX30h5S+Kub5lG9UuFI/29xqPcPWQxLXFxONp3k7KZzmFETO2zj+J3XhHz8MhJvdoh73nFvGEYhRL4cAYulXk9PD/F4nM7OzkJA53xIJpM8/vjjwDwq8dQZEjmX/okU52NpmpqauPrqqyu2OTIyws9//vN52xxMSVZEBRtbBZcuF1zZIdi8RGCUW8bOQl71vnezvywPxqe6GJq8omo78yFeF2do2xBmSw47YuMEHFzdvdjk++UiXnFikWEYhTzeuro6IpEI4XC4kOM6J5d2lro9fPgwMOOaqoR9+/aRTCb593//d6BUJb5y6ixJ/Jz2reWRfu9+C1G3xcTLBzAYumRpHdT7QV/kCNxwiY//6/oQYWMuExy3clBuNZgBk9GtY2TbM1gRyyOf4eKqRfO+RWJasPzyEK9Y0vl8PiKRCE1NXpZWa2srra2tNDU1UV9fTygYxGcYqIq3amR6peXYNo5lYeZyvPzyy0BtJLn//vtLDLw7d+6kvb2d8ck4Z+M2g/4OjgU3F6JI3vnOd1Zt87777qO3t7dg3smHbNkupO2LkzPSFtH4b2+po6v1wj2fV3euRyn6IjuGw3jXBOkVKew6b9EhfRJXdUHlgsgHOL8UvtrZiePhcJj6+nq2bt3KqlWrUFW1EMe3f/9+BgcGEAJwXax8/i2gSIm0bVzT5OTRo2SzWbZt28aKFSs4e7Z87gLAwMAAX/nKVwr/z0umI33DxILLOeX3PBrHxm1G0y4rV66ku7u7QO5yOHXqFH/6p386p81Ktrv5YLvguGCo3nywGApw9xUhHj2T43tHsriL5ENX23JQLufHxw5iOtOVAVTJ5IY4js8lfDoECqioYIKCMlPRagH3zC8uFkW84gn/YkKgZy8W8oGY+RIV4XCYW265hd/+7d+ec+3Nb3sbX/zc58C2USwbC5COgwB0AT4p0RwbcjlOHT9O19at7Nmzh7/5m7+p2Kf8ShhmpOTBgQxH/ZuR0xMbiRc79671fvbu3VuReADf+c535rSZmMdbkYeUEM/CZFaSsiBjesQDCOiwuU2gldFTN17iY3Ozxn99ZvF5tysbmvnNrVfxg8PPk8hlvP4gmVo5has71J2sRyLRhOYVGLKFRz6xYPLVrmpnrzTzpFkM8tUJ8j+6rhfmdcFgkEgkws6dOwFPDX7rW9/iW9/6Fv39/bS0ttK9eTPNoSBNfj/Nuk6LodNmGLTqOs2qQoOEOtfl7NEjQG3qNo8NGzawYcMGklmTH4y3F0iXx88HrJrbzNsZ29vbufLKK3ElpOZRszlb0huTHDgvOTbq2fcS2RnSAWQsmMzMP8LtEZX/dlMdUf/iZ1BNwTDv3XYVbeH6mYMCkstTTG6axK63sYOerU9qckbtLkz+1KZqi0lXXDFqMZWawLOR5QMvhRDYtl0olBMOhwmHwxiGF+Hx53/+5/zsZz8D4OGHH2b58uU0BoO0BQJEg1lcJJqUhIUgontE9ukqASnJHj2G6zhcd911NDQ0FLwHlZBfjDzd72DK0uBKVQhuXaPjSNixYwcrV66kt7e3apvveMc7UBSFqVlBAeDVYzw/KRmc8v6uBCEgVGYxUQxFge4LnPOFdB93bLmSHx09SN/kTL2XdFsaqbpEDzcUqpqqORUha5d8+cXFgsqUGYaB3+8vkCMUCi1Y6gkhCIVCmKaJEKKQaJMnXj5EqVK7zUJwlarSGA7TGA4TUMoMRi4DZ3owjxzGv6WbW265hXvuuadq//KS7LFzpUk+AvjUVSFawipJS1JvCN7+9rdXVeHFbSbMUmqZjuTEKCTNcleBpkDAgKAGuiqIBjx1+4uAoWrs3XQZD518meOjM/nQmeYsbIkRfWUmJVNFnVG7tYm+2mun5NVgXV0d0WiUhoYGIpHIotRtY2MjgUCAaDRaSPLJz/ECgQCBQKBiu21mlqiZg3KEm4XMCy/g39LNnj17qhKvra2NK664gowteX5wJhxdAL+/PcDqBk8CJiyXekOtae4YDod585vfjKR0fpezJYeHBeYsb4WmQksImoOCoPH67mioKgq3rt9GWPfxwsCZwvFM4zT5Xm7wJJwEVU6XT3OpKPWmBVllVVuuTNmGDRvYu3cvzc3NKIpCa2trpSbmwDAM/st/+S8LumZOGwtwUmdfPAgf+B1uvvlm/H5/wWRSDnv37kVRFPb3m+SKCPGujX4uWzYT3JmwPGNCLSo8f9+ULck3aTtwbIQS0gkBy+pgaZ2o5ftUAp8qaPYrTEdg1WSIno07Oz+JlDkcaXMq+TLPjj5QMJlcv2ojmqqy/9ypwvke+SaJvhItrGzVnIo33auscqsSb/qkwmozEonwsY99jKVLFx4LJqWsaY41G+XyWpOGj9mhjoquo0Y98S9UFek4SMfGmZzEPHOa8KrV3HDDDYXwpHLImzyKs77essrH21b7Ss5zJaQsSVjXq6rwghnFzJfmgONjkkzRY+kqrG0W1PnKtVAdK8IKxkLZOgurwjNpoevqdpB1UhyceLxw7OrOdShC8OzZmbyTTFMGZaOg/nDUq9ssBYqpeH/PQ76azSnF3oRgMEh7ezumac4JinzxxRcrtpPNZmlsbKx2u5owbhi4ho8lZq5wzLUsVEWgN5aGfcvmFswjRzBWrWbPnj3zEi8SibB7924cCc+c94i3o03nzk3+sucnLElYF+zdu3de4um6XnhPU9P2u3NxSWKm2ygC1jcLwosknSrAUASxWIw777yz5LMjR45Uvf69730vPt/MzW+99VbuvvtulgZWcZDHS87dtWItQAn5Um1pFFOl7lgERSpe1fppdTvffE9RlNpXtcVlylzX5dFHH63l0tcEacelR9O4PJelrWhVbQ0PA5SQT6gqzqCXP7Fnzx4++tGPlk3Hu/nmm/H5fLwwZBHPSVZFVf7z5fOHkI9kXNqDCm9729vmVeHXX389DQ0NZB2J5Xr2uYGiXGsBrGtZOOlSJsRznnnFcSUbol5pkMWMyewSHfkobFca5U5n14q1mLZdMudLLE+gJVVCvQrYoLreYqPCfG/hebW/DEjaNoM5k4fTWc5bparYGh7GGh0piap0xkZxJiYKi4dyKGT1nzNpCSp85ppwxT70xyWjaUk4HOaGG26o2GbCkkgJZ2Kl729ZPUTLC9Q5sFwvWPTFAXhlSHI2JhlNSlK56tcuBoOxXUykNpb97PpVG9nYsmzmgID4minsegvH59n3pCjv053WoNUlXrlC2eFw+HUlYf/wCCOZLCJncn8my611EVYYM49ijY3hWja+9vaCj8k6fhx1165CQnU5SFdyuH+KL1/XQrVvZDwLZ+IuLUGVBx54oOK5U6YX6JktytuO+GB5XfV5mQsMxmFgamZxUgzL9X7a2tou6piMpuDFnrtZ0fIoa9vnFpW8aW0X8WyagYQ3b3d1l8n1cZqSTbimi2IrM4bJWd1SFMVRly5dqruu+7lyN8+vavN7SqiqSiqVYu3atSXzgl8UTNPkkUce5cmnf8pkKkPKtMlKlQGp0m5o1BeNo8xlcXM5tHAEhMAeHkZrb0etq5vr8ATcdJqpe7/HFT//AWzcjAxXzlLLWN58rSGgUGeIck3iShjNuoxmXE6Nz7x/IWBDi0CvkvxvOpJjIzCWnn+RaGgC25U0B5WyrrSFwpFwYMji/z6YxnQgnl5FJtdKa33pHF4RCh3RJg4P9+NIj2F20MY37kNP6yiWN98rVyw8nU7/hbj00kuDtm3P6+DLky7vVciHKPl8vkJ2+cVEkYHBI/70jysFpm2TSudIptJksibSBb9q0OAP0u4PcrOSYa2TLGlPDQYxlncg5umrOTqCPT5eopqlz8/U+34fa8v2ecOWpIRYxrM/NgQqP9OpMRhLz7S/rB466itLu6wNh4e8uWExFAFNIWgMQJ1PlA2HXwyeGzD5h4OZOQTXlCy71n8RQ4+Xve6lwbP8e8+MnztyOkL01Sh6QkfJKQhHlCwyHMdhdHS0bcFlymzbJpVKFWLiqhmQq4p/UfgHpr0kEoEQClIoCEVFKipSqNhSwXQhSwDLH0aoPmwjiKxrYbzzMg5EO7h54Fne0/MgYvq+TjpNrq8X34odzoR7AAAgAElEQVRORJnIYaOlFdXnJzc4APkql7ksdf/fN+i5/g6Ct9xCqIxwFwIagzUYsC0YLyKdrni2ukowHcnREVFCOiFgSRiW1ZcPElgoLAcmMpDIwakJm/tPzSWdrqbZuf4LGFqybBsA7ZHSjT+lIQvutHKL2umFanVzSp44+YzxfJZ5xS2l5n2vYubf6X+k18g00QRCUUFRQdG9rdY0A1QVdB1X9eEaftyAH7dpJWJpF079UnLaDDN+cMlbmPBH+ciRf0F1vfBzN5cj23sG3/IVKP65LFLr6vD7DMxz53CnN0gRUrLmie8xNjWE+K0PIBcp3c9PlarJjqgomy+bhyvh6Ijn2chDV7zVb+QCZzeOhPGU90WI5wAJ4xmHn5z21GoxNDXDzvV/XJF0AM+cPVHyf31KKzWplPHfappWmzklT758hag5IVFlXuTMimaabHm25QmXv14oyGmyCVUHRQNhIDQ/Qg+AHkD4QmBEEEs347avRgRbEWJ+p+UT7VeQVIP80av/P4YzveWRZZE724uvYwVKYK5uVHx+fCtXkTvfj5uemXk0H3wKy0yQ+cBHkMbCRj5rl0o7QxU0V86OpDcmyRQtQlQFNrZ67rPFwnJhOOFFvBRHu4xlHH5yJl3ipQEwtCS7NnwBTUlXbPfk+BCnJ0Zm+mqp+IcDKM70/K4MMYQQGIbhVJ3jlbvQ+2PWrjL5e4iZz7z5mUf4AsnISzUFFA2h6UjVQNF9oPkRRtAjmxHGjYQRl3ShNqxD1Vuh6lpzBroCV9vn+PDP/h4jW/R4QuBbvhx1vsWDlJjDQ9izvCz20g4GPvBx6pdULlRdjN6YN9h5rGwQLKmwZhlLSU6Nz/xfER7pFivpLBfOTUpGU3NzdsfSDj/pTZdIVgBdS3JVDaSbymX4Hy/+lKw98y2JnqwnfDLize8yikdAWSrxpoVYeMHEK9lhWniEkkJ6+7AiQRFIAQgJSp5oCggFoWieRFMNUHSE7km1PNmsehN7SSNGyxX4AltQReOCnOQhQ7CuSePmVT5WTTv0lcHzhP7+L1HiM0QSQmC0L0Wtry/fkJRY42NYY2MlI5aJttD7gU+wdFXlGirTTXDgvMSZljCaCjuWzu+HtR14aUhiFam8akStdO+BqflNMGNphwfPpOcEKOhqgqs2fB5Nnd+fDWC7Dv/68s8ZTs4sOPSETsvzLehxHS3lBYoqUikb66VpWqh24omigD8Fj1yFkgd4AYEKSEWA6pFPaFphviYUA1QfQvEjtAD4Dcy6LNm6OGrrZsLh3QS0bhSqLBGLuyQEzQHB9iU6N60yaCgTAJmzJfboOM3f+SuM0cHii9FbWtCbmudt345PYg0OliyQrHCU7B98Erd92bzXgTdXe75fFni7rM6b382HU+OexMujMShYN3/X5sVUFk7HSm2GxRhJOzx0Oo3pzpZ0Ca5aX510AA8eP8SxolApxVZoPtiMb8SHltRQsuWlXR61ES8v4cR0epvqxeK7qgQdXNULrpI6SFWApiJVFScITsjF8YGrS6QBriaRuovth2jknUS1W/Gpq1ioCu2oU9m13Me1K/SSFZ4jYSorSZmQzEHS8iQJgJ5Jcul9X6d+8HTpS4g2YCxZUta2B+CmUuTO9yOLqp/KYJjURz+Os2JVxb4OJ+F8HIK6ZE3z/KvRpAmvDs2MkKrAtnYvBq9WOBLOxiTDFdYCwymHh3rTWOXmdOs/VxPpnu49zvP9PYX/CymIHo0SOhtCS2ioGRXFVgo7jZdDdeLlpVx+O3NV4uiuRyJD4hrg+MBucDCjFlYohxXM4hgmUildJoW0y2jUf4s67XpU0XzBKjQPKWEs5dnJpnJz5zLFUG2Trff/HS1nSnfqUUIhfMuWz2vrc7MZsufOzrAYkIaPU3f+IdEdmxcVhlSMw8OlgQOrGgWtlT12JUiZcHJ8fikHMJRyeLgc6dQEV6//PIpWnXSHBvt4rOdwybG6sxEixyNoUzpaRkNYwrPdyfnfSVXiFeZuqvTqafhcnIDECUpybSaZlgzZaAqplquFrBHV3k6T8ZsEtW0XXYW6EgYTMDglS1ZqVduWLpsfv4dlL5buQqT4fPg6ViDm2ShGmibZvj5k0WTaVTUOv/0jLL3uMrRF2tIns3BsZIYMAR26l5T3hJTDUALOTs4NqS85J2Xz0JkM9qyTfPokV63/AooyTwh0EV4dPse/nXyl5FhwJED01Qa0KQ0traGYygzpKvSnMvEE3vxNlTg+xyvmEnZJrk6RXJbA1eeSTaOBZt/vXnQVOhuJLJyeKI1pmw1FQFCHkAFBQ+DTwK+CT/O0qu+JR/D/8H+WiEihafg6OlD85b8k0rLInu1DmjMDJRWF1J0fwtl1Tc3PWozZ0m5Dq6gpcMCdDjoYrWxmYyhp81DvXNL5jRi71n2xJtIdHx3gweMvlTj9fXGDxkNNaJMe6dScWhPpwCNeeTvetIqVisQ1XJyAg9VoMbF9AjNc2tGQcgUt/g8R1nahsLBVaJ2hsLFFZffKuSp0PowkvRdeTqVGfNAQENT78MLGK3Qm96abcBuiBP7pHxCW90zStsn29eFbtqysuUXoOv7OleTOnsXNeapJuC7hf/0O2Vya3JsqV5KajaksJaQLGbVFq1gunBiRJKpw5nzS5pGypBtn14YvoVCddKfGh/nJiZdLSKcndRpeaUBLaGgZDdVSZ/yyNcYpzG9AVjyJ5+ouVtBibMcYdmhGxET1vXT4/xJF1G5kUgS0BhW2t+u8dZVB2FiY72cwAX2zQouEgLYwLAkL/AtMhLG2Xo4bqSf47W+gpKZFh+uS6+9Hb2tDb5gbuCo0DV9nJ7lz53Az07YuKfHf9z8ZmciRuentNZtABqZKn2X5PNadYuRsODpaeT4H0J+webQ3gz3rG+rXJ2omXW9sjAeOv4grZ+Yyekqn6eVG9EkDNaWimlVj78qissRTPYmXWpkqIR1Ae/R56tRXSaYr7xxtqIKVUYVrVxhcucxYgPItxXha0jcrcj5swKomQXABhLNcSOaKVr6+tRjv+QI77vs6oYnpLQqkxBoaQpomRtuSOW0IVcW/YgW5/n6c1IyuW/Hk9zmTyTJ++7tpClSW/TnbC63KI6h70roSUiYcGy219ZVDf8Lmkb4MzizSBYxxrtrwRaD6Nlnn4uPcf/QFnKKgWS2t0fBSFD1moKbVgnrFnT/aeD6UneNJMU06v4sZMRm/cpxMS6bw+Ts3X84lDV4hwBMD7+Hc2JuY7TcTwIe2B9i17AJ8PdPIWPDKoCyxRTYEBeuaKqvTPLKWt+qNZbzBKwc9m2T7vr+hob/U96hGIviWLS97Iykl5vnzOInSLZwyN9yCuefOOecXI56Fo0WLitVNgpYK7rRkzpN0TpWF1LmExSN9Wdw56nWUqzd8iVpI1x+f4IdHDhRKWQBoWZWmF5swYj60pIqS9SRdwTW2EGmnaaHy8Xh5I7HmLSwySzPY4ZlOrGlaQlPQW+83RV5FU0wmkpvm3ODlEZtVUY3W0OLDKaSEY2OyxIkd9Xt5CtVIl8xBz4SkbxKmclSUFK5mMLhhJ6HYEOHxGeOoNE2cVAotXOe5+YoghECLRJCmhZubmazpZ04ipIu5ZuOMe3oWfCokTE/y1flgRXT+58lLuqqkm7J45Oxc0gWMEXat+2OEqL4TU9/kGPuOHMByZ85VsyrNLzWjjxvoaQ0lt3jSASiK8mdliScUUVC1Uvd+Mm0zEm8wEaOrrQNteiDqQz3U+c8zEt9B8WuWEvYPWEQMlUuii7M3DCe8aNg8/BpsbKucAmg5np+0N+YN7HxQxPSEPuB5ClrrFJTLLkdTBHrPsZnnsG2cxBRKKIKYbTcRArWuDmlZhQUHgNZznPiUybGWTTQG50akCAEtIUFbWLAkUpl0R0eqm4zOJeYhnW+Yneu+hKJUtzmdnhjhR0cPYheTLqfS9EoTxtg06bKqZ6tbJOmgAvGAGWe/KlEchVxTDsfvdch0bMbTCdY3txeCBIL+IZrrXmVwcidyVumHV0ZtMrakq2VhpRUc6RlGC+9SwPpWgb9CM1kbjox4xuTZUAVEg4L2iKCjXrCyQdAWETQEvNTCoC4wNIG7dgOyoRH96MsFc4t0XZypOKo/iDDmTirVcBjpOLhFST/hcyeROZOhji4a5zFjVgrkrJV0ZxMWj5ZRr0HfEDvXfrl20h07WDqnM6dJN2qgpTTUC1CvxZifeILpkBIKalczVTLtmYJAi2VSKIpgedEuMj49Tnv0OQYnrsadVaTgdMxhKOVyaZkyqvNhcApiM4KW1hAsicwv6pImHBmeO/kOGbCiHtY0e2FJYaN8ya9iOMs7cVZcgv7Ki4j8XEdKnKk4QjdQ/LPsHkKghiO4loUsknzR86eoCyq4aypvZzobGdt7lmqkOxO3eawvM8eAHPINc2WNpDs6ep4Hjx/CLVqMaDmVxpc8Saelpu10tpiJKL6A9A5FUf6s/PdtOidSuALFVlCzKsa4j8jpUjvBM30nOTJSur+W3xjj2g2fxqfPTd5+7rzFn/00WbU4DeQ9EzNPpwgvZHw+5Gw4Pks6qIrnfupaImgJ1+4NyMPe2E3qrs/i1s+EQkkpMQcHvMiV/DEzhx2PYw4O4ibLlG5f6m29bruUxNrNB8uB46M1kG7S5vGz6bKku2Jtber11aFzPHTi5VLSZTSaDjV7pEtOSzrr4pAuj4rJPsUQCLSMhh2xS0wrZ2KjLI1ES7YxEorNipYnGI1vw7RLK0rHspKfn7e4rsNXUc3EMrJkbtcWgeZQeeZI6anXXJGkM1TB5jav0M2FeFKdunqmuq5AP3kELTmzenXTKezYBNboKPbEBE4i4anZWSaM3NVvxrzhZsALGjgxJvFrnjdlvmc5OipJVzGznYnbPHY2PYcDIf8QO9d/GSGqk+7QYB+PFuVLAOhpjaaXmzAmDPSUPqNeLyLpKs/xKMoym67+iPCs1rnGHK5vZqvInvERVja0ECqJ0HVZ3vQkyWwH6VypLSxtSZ7sM9m1XMevlR8AL3p3uh945ob5srL64rJEJesKdC0Bv75wypmOZCIjGE5K+uPQF4MhK0D/+l3UjZwlODkTcVsxIkEIctffRHbve7zQMDwVn3ME46nyUwYJnBj3PBqVcDpu83hfOdINsnPdV6he8MyrBvB077GSY0ZKp+GlBnwxH1rKC2+62KSDGogHM4ZBIb2bCynwJQxyTTlc3XtAR7ocHxugM9pM2Cid+7RFD2DZUaYynSXHTRee6LPYsUQj4psr+vy6QEpvbJfVe5KrHFImnJkdtdsmCC6AdLbrSaPemOTsJAV7X/Fc0VU1hjZeiZFOUj98Zt62ZH0D5rW7ybzvw1iX7iyQDqYThAKel6WcGD4fh5Fk5dHtmbR44uzcxJxIoI8r1/0JtbDjyTNHea4otAm8QM6mlxoxJqdJl1MuePU6HxRF+bOa4vHyoVGu5uL4HZywQ645x/i2cRxjZnT8ms4dW3bSEprrM+obfSunBm+fc1wVgruuDLKpeXHFBI+NSCaLJERHVLCsyn4RebgSzk9JBqYqC6/ZWH3gQVpPvYgIh/DVhZGROpyOTpzll+C2tNZm1carazyagtaIF/hwdFRWHOB5SRfs44o1f1b1fq50eejEyyVBnOA5/BteaUCf1FHTF2/1Oh9qj0AuChqQusT1O1hhm1xblvEtEwXJBxDQDO7YciXNZcg3GNvJkXO/wxwvh4D3bwly7YqFOVunct7Kr3BvHbYumcdiOwvxLJyeYE7OQTEM1YsFDBleMKdf90w5F1iYqYCM5ZWjCOqQdUrC/ebgRMzi6f7MnC9IfaCPy9ZWJ53l2Pzo+Iv0ToyWHA9MBKh/tR5jSkdJqTOr19eIdDBNvO7u7hCQrFpStsh/K3WJ43ewwza51iwTW2I4RWFSAd3gjq7y5Iul1nHo9N24s2x9Anj7Oh/vWFdjMRE8G1exv3NtC1V9pDB/hIsQnr+0IQD1fnnBAZ7gSVLTkZiOwJr+bbueJ8ZyBFlLknUqS9wTExZPn59LukiwlyvWfLVqH3K2xX1HDjAwVWppCIwGiB6JFuLpCg7/CmXGLgY0TQuJNWvW1AWDwXhNtYznIV+2LcNEV6xE8gV1T/I1BeeSL51r47mTn8Vx55Js13Kd391WfaNf05G8eH7m3YQM2LKk+jMMJby5XDEUYEkdtNeJRW94krMhkfNSEzO2IGN55Krm5qqG4xMWPy1DuvrAGS5b+7Wq1yfNHN9/dT/j6aLAPQnhgRCRE3VeaFOedM5rTzqY9tWGw+Ggz+f7dK1FtAsJunJ6weEKFFtFT2lkW3JIxeux5TqcHBviksZWgnppoICupVja+FOGJq7CkaVhVf1TLsfHba7uqBxckLVFSX5BR72nEishlpH0TJQeixjeYqSpjFurGlImDCU819y5+ExmfsbyFiwXWkPn2ITJz85nF0268UyS//XKfiazRamKEur6IkRO1aEnvHB1xVQKRXZea9LB9Ko2FAqFg8HgpxZSvb1wbt7Q7EyTL6ORbS4l36nxIVZGWwjOSoZWFZPO1scYmbwUyylNMBjPSPaft7i+0zfvfMpQvVVn2vL8rB31VQI/bS9Dv3gQG4OipuI5JZAwnpX0TnhkS+RYUOh9rTg2YfKz/uwcDjSET3Dpmr+oev1AIsb3X3mOlDXjOxRSED0VJdwbnknMMb2MsF8U6WB6VdvW1tba0tIyvOACPIKZXZ0NT+1aIYtce5aJzTFcbWY0fJrO7Zsvoz1SLhla4UDP/0E8tWbOJ1G/4E/eFCZwgcVCJHB0uNR/W+eHjS0L82bEs14garoG78OF4PCYybMDc415jeGjbF/111Wv75kY5oFjh0qc/cIVRI9HCfQH0JPThuGcQHGLSsf+gqBpWkgNBoORcDj8icVUby901p1Wu1IgcgpGRi9Ru47rcnxsiLZIHVH/7KAzydLGZ0jnlpDKluaqZm14otfk8naj6v4OlTCekgwWebIMVbCprfZKSzlb0jPuSbhF7AhVE2wpOT1p82R/lhOxucxuDB9m+6r/XrWdl4fO8tDxl0uihhVLoelII4GBGdIp1kzu6y+SdDCtagOBQH04HP74YnfpmUM+V6BYKkZSJ9ecQ6oe+VzpcmJsiMZAqOyCo7X+IFLqTM6SfLYLT5012dSs0xBYeB+lhJPjpepwXUvtUcvjacnxUV4zKTeWdnhxxOTxsxnOxL0ontloirzK9lXV99N4vr+HJ04fLTmm5TQaX27AP1JKuloTc14LKIryZ6rf72+IRCJ/tFjiwXzkUzASOmZzzkv+xnOvnRwbJmL4aQ3P9fg3ho/h12OMJbopNsa5En7Wb9IeUlhat7ApwUjKy7st3CNYm4HZBXrGvfKvi92Ybj6YruRkzOLJs1kOjeYYyzjzLkSaIkfYdsk3KvdVujxy6lUOnC9NVtfTOk0vNWGMexn+au71Jx1ME8/n8zVGIpG7LrTIYoF8+dWu40W2+OJ+zMZciamlZ2IETVFZVjd3zhcJnKMueJaRyUspTo+UwAtDNn5VsLqxdi9Hz9hMlIcA1lbw+eZhOnM9IhcKCQwmbQ4M5XjqXJa+KZtsha3ghZAsiT5P98q/r9JXm/uPHeTE2GDJcWPK8FxgsWlnf64ogPN1JB1MLy7q6+tXL1u27JQ+TyLzgjDLzuf6XOyQTa4hS6x7EitUqq+u6FjNNZ3l49QSmWUc6Pk/ccts+rv7Ep3f3Fzd1pcyPc9AHk1Bwdoq9Ugytrf5SSWPxkKQtiUnYybHxq05W0qVg66maG98ltVt+6rmvCZyWe478jxjqdJQrMCYn/ojXlVOtdgbcZGd/YuFpmkhEYlE1nV0dBy/KMSDUvJpXsKQHbSxoiYTW2KYdaUvs3vJCnav2Vx2gmvadfz8xB9j2XPrOXS1atx9ReViczlb8uIghRe9uVUQqeAYyVieyWV2FaWFQgIDSZtj4ya9cbvqOAvhUufvY+2y/0V98FSVsz2MphLcd/h5kmaRWJ5tGM5MO/tfYxfYQpEn3obly5cfze+WeFFQ7NvVPFOLE7Qx6yziWybJNpTGpa9uauWW9dvRlbk60Hb97D/xRbJm05zPOuoUPndNpGLVgVhaMpb2olsqZXHlI36rpQ5WQjzncmLC4kTMIlODcc+nx+hofpzOlkeoJZQpj77YGD8+9iI5p2i/NSmoO1NH6EwQLanP2Oh+gYbhWqFpWkiEw+HNHR0dr15U4sFc8vkcnKCDXWczuSlGpqV0AtUeibJ302UE9HL9UHih524mU3PVcoNf8JULtPVZjuTVYbEo9eq4krMJh2PjJgPJ6tJNETYNkWOsa/8eQd/wgu41MBXjuf6ekiqcAMIRRI/XEzwfRE1OG4atX7xhuFZomhYSoVCou6Oj46XXZPuAfEjVdGmzfA0WO2IztSFOakm6JJIk6g9xe9dlZWx9Hl7u+wij8e1zjgd1wZeuD9O4iA2CXenNA2sJSS/GWNrh2IRFT9yaU4FpNgSSoG+YlW0PsCT63IL7eCY2ynP9PZyPT8z5TDVVooej+Ef8qEl1xkb3OhiGa0WeeFs7OjoOvWb7VsyK53MN15N8YZvkqiSJzoRXlWoafl1n78bLWFpmxQtwavBd9I3OrVGiKfCZq8OsrF/Y6nx2QcRKMB3J6bjF0TGT8Wx11aiqGVrqXmJt+71Vi1jPhpSSM7FRnj17sqTyZjG0tEbDyw0YEzpaWvcKIub3l5inBvEvAzRNC4lgMLi9o6PjoH921tQiMO/WAvlUSSFBA8dwcAIOTtgm1ZEmvjZe8HIA6IrKLeu3s7qp/JakZ8d3c+r8Hczetl0R8Ps7QlzaXpu5ZWgKeicrk05KGEjZnIpZnJm059QimQuX+kAfq5fcR0PkeE39KIbl2BweOc8L588Qz5avQ6zmVILng4TPhrz5XFotRAznd1Gsdbfs2ciP4WJ2Xq8VeeJd1tHR8fxiiFfcydr2s8CTfOq05PN75MsuyRHbVOrfFQjevHoT29o7yzY3Et/Gq2d/Hynnqtff7PKze2VlCZ7MweGR8lWnwNsW9NSkybFxs7DlZyUUzCDt+2oqiDMbadPkpaE+XhzoLSloXQw1qxIaDBLuj2BkdXRTR2QUrKSFm3UxNAN3Og6rWNrVQqL8ObOJV1JgnVLhMt811aBpWkgEAoErVqxYsb9W4lUiWyUCFj7LBxeoXiUqN+BiBy1yrTkmuyaxfaXLyiuWr+aalfPY+rIrOHDqU3NtfUJw4yUG75lny0/HhUODzJmbua6kL+FwImbRP2XVYAZxaIwcZU379wn7BqqcXR5jqQQvnD/DsbGBkmTqYhgJg2B/gMBwEN3U0XM6k6cnGR8YJ5OayXKqj9bT2dnpJWZRWaIV/19RlDkEy3+W31Zi9riXOz//WTUC5uvjKbVuvpZvdPZOjoqilOx7Ue4B8nBd13NgOxSqgmuujpAKLabOePcEZmhGYjzX38NkNs3b1nWjzTK3RPxn2bXuS+w/+XlspygbSEoePZ0jnnH5/UvnGpp7Y5J0OovrOvgCISZzLicnLI7HLNKpJNJ1UAPz1xqrZgbJJjyJ5Y/Mbxvti41x4NxpegdGEeEyAyXBF/cROhfyMvmzGrqt48ZdThw6gZkz2blzJ9dffz1Lly7l4MGD/OM//iOs8PbJndNcviKClN4YuG7hmOu6JWNYPMb582cTrni8i/lQM/mABc3Gi2+Q38dWVVVyuRymaWLbdslDAWiahmEY6LqO3+/Hdmwcx8GVLoqjIHMSXdWRMQmPCkZDo2TJIpoF6maVE2ODxDIp9m66jIivVIr5jTGuXf8Z/u2ROxh75WWiW99CoN0LNHh+0GLoqQRfuC5ScL49+8xz/PevfoXjzz8JQuGyT32XyZxk5Kn/Sfzlx7DT3kRer2+hftN1LH/np/EvWYWqmLTUH2Ttkh/M2dcrNZ7jlR/3ceqnQ5x/eQJ7OsHXCGqsvmYJN9zVRXRZaDpKZ4AD584w+L8mcJ52kEmJukvFeJ9nRhKuwDfhI3wuhD5heKvUrILmaKi2ytEXj9LS3MK//Mu/cO211xb68KUvfQmAXC5HNpstGYNiAuW3CHNdl0gkUtgaTNf1wq5NpmmiaVphl87Z45nfPHtqagrHcYhEIqiqWjivJtXu9/uv7ejoeCoYLO+CKpZyxYQTQpBKpRgbGyMej+M4tVleNU2jta2Vpe1L0XQNRzpMTU0xMjLC5MRkQU0UOtgm8P2hDxEVRHx+9m66jJbQjJd/tGeKfZ99nuHjkwCo/jDb/vIAet2Mb6wlqPDFqwJ8408+w//4f75BfX09d9xxB//2b//GufODuLZJMBjk5ptvZt26dQghOHHiBD/60Y8wbYc3fe5dXHX73Oo/mUmTJ//uMIfu68WxXDo7O7n++uvp7OxECMGxY8d44IEHcA2L7q9cQo9vmJSZw/yuifOcw5vf/GZaW1v513/9V4IfCxLxRwieD3hJN5aKyIqCPU6XOqODowycG+CZZ55h586dM/3IZNiyZQs9PT1z+lgJuq6zfv16TNNkaGiIqampsp9rmobjOEgpUVWVWCzGwMAAtu29E1VVWbNmDX6/v+wccDY0TQsJv99/fUdHxxOViJf/nd/JMZVK0dvbSy6XIxqNcuutt3L11VfT3d1Nc3PzHFGfTqfp7++np6eHRx55xBsM12XVqlVMTEwwMTFBNBrl9ttvZ/fu3XR1dREOh9m/fz8f+tCHsDZYGL/nSQRd1bh53VbWNLWRnTL5hzseRcn5+MIXvkBdXR0f/vCHWfuf/4Gmne8s3N9Oxej5uw8Te+UJfuM3foNvfOMbfPvb3+aLX/wihmHwqU99ik984hOEw6Wuub6+Pm6//XYOvXyI3/rWtXTsmCFz7/4R7vv0c2TiJnfccQd33303u3btmvP+jh8/zrZt27B32ejv0pFJSfazWf7T7/0nvvnNby2Ag8QAACAASURBVDIyMsLSpUtpWd1Cy5pmrJwNlrd3RN6/qqCgCpVXDr3C7t27+fGPf8w//dM/sW/fPs6dO8eKFStYtWoV27dvZ9WqVfh8PhoaKu9A9O1vf5uvfvWrNDY2EovFaG1t5Xd/93d561vfytKlSzl16hQf+MAHSCQSbNq0CXO67vPU1BR9fX1ce+21fPKTn6S9vZ13v/vdjIyMsHHjxgIZoTLxNCpUyJ7NXlVV6e/vZ2RkhM7OTr785S9z5513ksvlmJycZOXKlQCcPHmSRCJBNBpl2bJl+Hw+urq6APjYxz5Gb28vH/nIR3j44Yfx+Xx8+ctf5o/+6I/IZrOMj4+zZs0aNE1j1apVPPjgg9zzg3sK/bAcmx8dO8i1K9fD05Kp4Qw//vG93HrrrfzBH/wBQhGsuUKQz6fKjfdz9Kt7scbP8bWvfY0PfvCD/M7v/A4/+clPWLt2Ld///vc5d+4c733ve4nH4+zYsYNPfepTtLe309nZyUMPPcSmTZv4979+hd/57psBOPJwP/s++xzLl3Vwz4/uobW1lb/927/lk5/8JI7jsG3bNj7/+c+zbNky1q9fz8b/3d6ZB0dVpf3/c/v2vmQhO2QhJCEYQgJBRHFDYNhhRgfNDJvLCDLqUDjOTEmJP+sdsRRnHGTQqUF0sBgE4yC4ACIuCGrYjInKDkISEsjS6U4n6aS3e+/vj+ZeOhuCztT7vvXmW9WVTve9p8895znneZ7v85xzrrmGr6vDRxwoFxSQ0U71TkxMZMyYMRwqO0R6WjpCuw85JIcjDhfPitDpdHjcHkKhEL/73e946KGHePnll7njjjvYsGED11xzDU1NTXg8HmRZxuPx4Ha7ycnJweFwUF5ervVlW1sbJSUlvPLKKwC4XC4mTZrE66+/TltbG8nJyZhMJrKzs1m+fDkLFy6ko6MDg8GALMu0tLQQGxvLli1biI8PD8T58+fz1FNPXd1BzWazeXx2drZSWFjY42vYsGFKQUGBMmLECCUxMVEBlAULFihut1t55plnlPz8fAVQxo4dq6gYMWLExeVAKHq9XsnPz1eWLVumnDt3TrsmEAgo99xzj1JRUaGUlpYqRUVF2j2//OUvtevmz5+viEZRiXo+SrG8aOn0smWblfT0dEWSJMXn8yn9+vVTBt2QpDxe8XNl7q5XlZEvnVAsKdmKxWJRtm/frpw4cUJJTU1VAGXo0KFKXV2d8sYbbyiCICi2OLOSNDhaEXSCEh8frxw/flyrwzPPPKMAyr0bblPu2zhO0ZtEpaCgQGloaFC2bt2qmEwmRdAJSnSWVTFm6BVAWbhwoaIoilJfX69YLBZFvF5UrKutSszPYhRA2bdvn1b+n//8ZwVQiq4rUoquK1KGDR+mDCsMvwoKC5SioiKlX79+Snx8vOL1ehWHw6GsXLlS8fl8yuzZs5X09HSt7dTXiBEjFJ/Pp/zjH//o9p0gCEpMTIxit9sVm82muN1upaSkRLFYLMoNN9ygBINBRVEUxeVyKYIgKOnp6cqIESOUwsJCZeDAgVr5Ku6//35FEARl5MiRSmFhoVJQUKAUFBT0KlMjR4606pSeiDA6eyoAHo+HhoYGFi1axJo1a1ixYgVLly7l3LlzAGRmZmr3nTp1isTERPLy8hgwYAA1NTUsX76coUOH8uabbwJh+2HdunWYTCYmTJjA0aNHyc3NxW63c/z4pT09nE4nRqOR1G8GYGy9FMdVGhS8p33Mnj0bnU7Htm3bcLlcFMwM8379o96jatU4go2VlJSUUFBQwNixY6mpqaFfv3689957yLLM/fffT3yWg1+/M5H735zAPf+8jVafh3vvvVf7rTvuCO+AUHmgkU9e+Ba7xcG2bdswm8386le/QkwExx+tBB5REO4I+2r5+fk4nU7uuusuOvwdxGfEk/lRJvZjYXU+ePBgnBd3nPrZz34WbuMmD3pBf+kMsItxVgWF5uZmpkyZwt69e5k1axZLlixh3bp1bNy4Ea/XS2ZmJrm5uURHR2MwGNi0aROiKLJs2TKioqIYOnQoOTk5ZGVlkZ+fT2pqKhaLhfb2drKzsykuLiYUCrFv3z52794NQGxsLHFxcQSDQQwGA6Ioao6E7+I+gPv37+f111+nX79+VzXj6biCwygURaGuro7U1FRWrVpFdXU1L774IgkJCYwcGd58e9Cg8PFK58+fp62tjdjYWPr160dKSgr5+fmMGTMGURSZO3cup09fSv154IEH8Pv9FBUVaUa5OoVD2Eay2CzoXQbiDsZhvRCmTUKHwrbEvHnzANi0aRNGq57Bt/UHYM9LR3CerGXt2rVMmTKFu+66iwsXwsmSL7zwApmZmSxfvpw2bxszl4/CZA/bpf2HxnLDPYPZt28fZWVlmpDExMRw7KMaKg82snjxYtLS0qioqMDlchEarxCMuUirXGz7tWvXMnDgQPbs3UNaVhqJ1YkY3AY6mjtITk4mOjqaZ58NL1HMyspi2LBhNDY2ohf13WyjttY2ZFlm+vTpvPvuu0yePJnly5fzm9/8BpvNRnZ2NomJicTFxdHa2sqsWbPIzc1l+/btnD9/noyMDO1kddVTVRSFuLg44uLikCSJzMxMzWE5ePBSPDklJYVAIIDJZKKhoYHDhw+TkJDApk2b2Lt3L9OmTUOWZdLS0rp5v5eDTpIkobeL1c+DwSDt7e2MGzeOkpISbrrpJtrb2xkwYIDmCakz3smT4c2rDQYDPp+Pjo4OvF4vgiBQUFBAMBhk586dQNhQ3bt3L2lpaeh0Ovx+P21tbeTk5ADg9Xo5e/YsNqsNoVXA0GwgriyehNMJSIckioqKyMvLo7W1lR07dpA4OhqDWeT8ETcHXz/NrFmzuOeee1i7di379u0D4LrrrmPu3LmcOXOGtWvXcs1PUkke0vmU6SHjw4uOPv30U+2zpKQk6k+EaZTx48cDYLl47q18IWJhTbYO8y1mTlSfwGgxkpObQ2xULPhB8At4PV4KCws5duwY69ev19iA22+/nZaWFoLBoMapQdi29ng86PV6Jk6cyPbt2ykuLuaJJ57QhM7v9yNJEvX19ciyzOLFiwHYvn07Op0Oh8OB3+/XqC6trjodSUlJpKamEhsbq7EVdXV12jUpKSl4vV7Ky8upqalhypQplJWV8cknnzBx4kS8Xi+5ubndggffy+P1pmrVm1UX2mazsX79etavX4/RaCQ7OxuDwYDXG17QkJ0d5s5UNWk0GjW+SFEUgsGgVjF1fceePXu0DgyFQvj9fhRFYdiwYQAcOHAAWZaxW+0IPgE9ekRZh7XcSrWzmlm/nQXAjh076OjooCFH4sPT39L09xbsNjurV68mEAjwX//1X9oz/eEPf6Curo7Zs2cjKRK3Pth90/DYdDuCTqC6ulr7TJZljepRBW7kyJGMHz+ejz/4GPkrGWuGFXPAjN1gx5RtQpTCB49IASkcHUDB5/NRVFTEwYMHaWxsZM+ePYwbN47i4mL++Mc/4nK5iIuL07xDQRBoaWlh9OjRXLhwgerqahISEkhKSsJgMGg0h06no6mpqdPMtWvXLmJiYrR+iOzXroKiHoJtNBqpr7+UrpWcnIzP5yMuLo7Vq1czbtw45s2bxyeffEJUVBSZmZnodLqrmu0grGa/l+0TBIGMjAxSU1M1W0Jt/NbWVgwGAwUFBUBY54uiiMlk6sb91dbWAmjE56pVq9Dr9URFhXm5trZwBofacHv37gXCtoYBAyZMWLHRdnELAdU2eu+998AA4hCRb76u5rvP67j33ntJTk7m3Xffpb6+nqybwnv0rVixgkGDBnHoy4NMfWIEcQO7Ryh0OgFBF57pVbhcLoSkcFPt2LFDe64dO3awatUqhqcNx1vmxfmNk3Nfn0P2ySiSgiIp2jqUttZwvUeNGsWhQ4cA2Lx5MwB5eXkUFBRQX1+PKIpamwWDQXw+H+PGjWPXrl0AJCQkIIqiNoOpA9nj8TBz5kwgbKJUVVURGxvbSSgiedieok1ms7nbjDdv3jyOHDmC3++nsLCQ3bt3k5aWpk02qvBHysv3oVcbL7JCKlMdExOD1WrVbASVvR46dKgmiKWlpURHR3cKr6jcX3V1NXfddRfDhg1j3bp1fPzxx6SmpiIIApIk0djYiMPh0Ga8PXv2hAnLJjcupwuP04O7wU19bb1GU4RCId5//33EXBGMEPoyBAo8/PDDAGzbtg29SeT2Z69jxB2ZnGk8Tvb4RO7dMI7Cnw7s9Mz+UJCv66r4Z+lnyCGFhITwWR51dXU0NTUhFomI14g8++yzmpNkNBpZvHgxZWVl+Hw+1qxZgxSS8Hv9WmqSTtCh0+lo94azTcaMGaOp8a1bt2rqtri4mLa2NgKBgCZ8qka57bbb+PDDD9Hr9d0GtSiKtLW1oSgKU6dOBdCENCoqqptgXK6PzWZzpxnviSeeYMmSJfz0pz9l0aJFBINB8vLyNNuwqxN6xYkCQK82Xk9xt0j1q9PpaG1tZdSoUQA0NDRw+vRpBg0apDWITqejubmZs2fPkpGRwV/+8hd2797Ngw8+iN1uJyoqiqNHj2q24vjx47UQ3IEDB5AkiWPHjnWrmzrbHTp0CJfLRdLIJFqVVuSTMtnZ2ZqduH//flKGxmCyG5j6/4q6ldMRCvCds56TTRc453EhyTLyybBaiiwDwJJgwdZqo+5YHfPnz8disTBjxgxaW1upqqrizTff1GZxm9UW3t4jonNbWlrIzc3F7/dz/PhxLBYLdXV17N69mwkTJlBcXMyyZctwuVwkJCQgyzKtra2YzWZGjhzJnj17tEGtxk9VUt/j8WA0GrnppvBhfh999BFGoxGLxUJHR0c31RoZc1VtyjNnztDQ0EBkNvoXX3zB1KlTEQSBrKwsoqOjNbWs7RjbS5LB5XBZAlltsMiwWWRD+v1+ZFnWBK+0tBRAm73a2tpwu934/X6GDh3Ktm3b2LlzJw8++CCCIDBo0CBOnDiBXq/nySefZNasWSQlJWkPc/jw4Z4rRZh4hUvqODWUiv+Qn8OVh7nl7lu062pqamCERH2bhyR7NL5gkMb2Fs41N1HV7KSu1dPpgDgA6VR4Brr11lsB2LJlCzpRR78v+lH1XRWFhYW8+eabHD16lOuvv55Dhw5pNpQjykF2TjY6IdysaptJkkRbWxuTJk3SZqOcnByOHDnCa6+9xoQJE8jKyuKGG26grKyMlJQUjbC98cYbKS8vp62tTRPISFUpiiLNzc2MHj0aq9WKJEns3buX2NhYQqFQp4B/ZD+qQtfc3ExNTQ2hUIg5c+bw3HPPdVLhkhR25AwGg9bnXVOlrjZ/T88V2niRhaujrLk5HB8dM2YMEB5lEA41Qdizve6667j77ruZOXMmTz75JGvWrMHhcJCZmYnf78fv9/Pwww8zY8YM/H4/0dHhhd7nzp3D7e6+czyEVZ9K3+zZsweT2YRJNCFWiyBBWlqa1mBerxe9Xs/GilIMotjpmKQeoYB0QKKwsJC0tDTcbjdbt25FkRWqvqti+vTplJSU8Nhjj7F69WrMZjPp6enhWc5mQxCETt6j2sGq/Tpp0iTWrVuHKIrY7XYSExPZsmULHo+H6OhoHnjgAS1UpdfrCQQCjBs3jk8+CZ+va7N1XhagCrXX69UGyjfffENzczODBw/u5OBF3iOKIoFAgHPnztHS0kJ+fj5/+9vfsNvtzJo1i/Xr15OVlUVKSgoQTj5QEwGAbpPQ1eKKeLzIBoysuNPpZODAgQwdOhQIu+9z587lww8/1MJmW7dupampiby8PNasWUN8fDyDBg3S1LXZbOb555/n2muvZeLEidoomzx5Mtdee22Pr1WrwnuISJLEF198QWxsLIpfQeoIz1RxceEVaaIoEhMTg+JVUFAuL3QKGNuNOPbYUVwKixYtAsKcn2o//eQnP+Gtt97ilVdeYfXq1SQnJzN8+HASExNxOBwoiqLNMFqxF997PB6sViu33HILH3/8MVFRUQSDQRISEujo6KCkpASAO++8k379+nHhwgU6OsK5drfddlt4gJlM6PX6TnaVKIq0tobX1aphONX5sdvtmtCpgqLT6dDr9bjdbo4dO0YwGOTpp5/m448/pqSkhFGjRlFaWqo5GKrg+Xy+bvbcj8FlbbxI9GRANjc3M2fOHCA8ytR4aUNDA9u2bePTTz9l586d+P1+bDYbQ4YMwWw2a/lggiCQk5ODz+fj1KlTTJkyBb1ez+HDhzl16hTp6enY7XYkSdLsiOPHj3PjjTcCUFFRQUtLCykpKUhBKcz4X2wkFdnZ2XxV+1WPzyQoAvo2PSaXCVuDFXu7ndM7vyM1NZV58+Zx+vRpnn/+eSBMK2zYsAGPx8OyZcuIiYkhY2CGxqFFGvvBYBCPx4OiKPTr10/j4qZOncrhw4dxu91kZGQQCoWwWq2YzWbWrVvHwoULsVgs3H333axcuZJQKITNZmPYsGHs37+fqKioHtPSmpqaiImJ0drlrbfewmazYTAYNPtO1VI6nY7KykqcTifXX38969ev58iRIwwfPpwLFy4QGxuL2+3WBC8uLg6j0UggENB+M9K+u9L8u664IlXbqbMuPmxLSwuKojB9+nQgTGm89NJLvPTSS9q1BoOBmJgY4uPjsVgs2rQfaaNEZrLMmDEDCHt6AP3790eWZSRJwmAw0N4e9gpVOka17+wOO1JQQq8Ps/5qGA9g6tSpfPnHL3GcshNKksKpRj4dhlY9xiYjYkBEDImYMFP3TR2+Nh/Pv/o8er2e+fPna17lsmXLSExM5K9//avmUMmS3Eml6nQ6GhsbOX/+fCfyXbW17rzzTrZs2QKAw+FAlmVCoRApKSns37+fw4cPk5+fz8MPP8yLL75Ic3MzkyZNoqysDL/f3ynqEOm8NTU1MWfOHIxGIxUVFZSXlzNw4EBNQFS16vF4aGpqoq2tjUcffZSlS5eyePFiNm7ciNlsZujQoURHR1NaWqpFeQRBIDk5WfO01c9+iCcbiSvi8SILVx/E5XJht9sZO3YsAO+88w4Wi4Xc3FwGDx5Mfn6+ZicZjcZOKijSsBVFkcbGRiwWi0YFbNmyBbvdjk6n05JLJUnC5XJhMBgYPXo0EJ7x9Ho9FrNFK9vhcPD5559r9b7vvvuwWq3I/1LI+TaH/of7E38sDkdlFBa3FXOrBYvXSsPXDTRWN/LQQw9x5513ct9997Fv3z5MJhMGg0GL3R49ehSdTkdcXJzW8aIoYjQacblc1NbWMnnyZI4ePcqIESNob2+nubkZu93OzJkz2bhxIw6HA71erwleXFwcOp2O5557DgiHHxcsWACE1aw2wC6mbYmiiMFgwGQy4XK5kCSJ2bNnA/D0008jiiIpKSlagueZM2c4fPgwlZWVtLe3s379epYsWcKNN97Ixo0bSU5O1rSRikguTxU8WZapq6vj7NmzNDc3d1K9V6uCr0jwIn9AFZrGxkamTp2KyWTi+PHjHDp0iOTkZGJiYrDb7YiiSDAY7GRodx0lqvA5nU6mTp2Kw+Hg6NGjVFRUkJCQQCAQ0DgunU6H1+slLy9PM7CPHDmCw+FAkiRqa2v56quvaGlpoby8nK+/DqchZWRksHz5cpznnZzZcwZLi4XoUAxRwShsQRvB+iDfffkd9efqueeee/jTn/7E7Nmz2bhxI6mpqTgcDgYNGoSarzh48GBkWeb8+fNYLBYsFgtms5mGhgaqq6uZPHkyW7duZfPmzZSXlxMTE4Pb7eb222/n4MGD1NbWdgqoy7KsCcqmTZs4cya845MaEhs3bhyff/45JpNJoznUtKempiaqqqoYPnw4EydO5MCBA2zZsgWbzUZTUxNNTU2arf3UU0/x5Zdf8sorrzB37lyWLl3KiRMnyMvLIzU1VaNIICzY6owHMHr0aNxuN19++SVut5u4uDhqa2vxXzwq9YfYfVelalVBcbvdSJLE/PnzAXjttdcAtEwGdXbrSlD2VJbHE84zKy4uBmDDhg1aWV1tCZ/PR3p6ulaGqtLKysoIhUJMnDiRiooK6urqeOyxx3j//fcBeOSRR5Akiccff5yDHx3EZDIh6kV8HeEU8fj4eF5Y+QITJkxgwoQJlJaWkpKSwoABAzhz5oymbgEWLVrE22+/zWeffYZer8dsNhMIBAgEAkybNo3NmzfzwgsvcODAAWJjY6mrq0MURR555BGeeOKJSw5PRGeFQiH69+/P+fPnWbFiBWvWrCE5OZknn3ySgoIC9u/fj91up7q6GqfT2W1ZwcqVK6mvr2f27NkaBROZTbxixQp+//vfs3LlSn77299q7QvhiIzRaNS4wVAohMVi0WLuAEuWLGHDhg0MGTKEkpISPvjgAxYsWNCtn68GgiiKv0xPT9+ohq16QuSDGgwGvvvuO0wmEzU1NQiCQHp6Ou3t7Ro5qnpSqkMA3ZfCqWWdPXtWm0HMZjOZmZk0NzdrZanlmEwmDh06xKJFizQ7MiEhAafTicPhYOfOneTn55ORkUFrayuSJLF8+XIef/zSoUU1NTW8+uqrHD16lNbWVjIyMhg9erRGHyxbtgyPx0NaWprmFLhcLiorK9m+fbtmCkiSxObNm9m5cyc1NTXExMQwffp0pk2bxuLFi9m7dy9nz57F6XTy3nvvkZSUxMCBAxkxYgTJyckkJSV1Wp+gPl9VVRUul4sjR46QnZ2tDapRo0Zp7Tdv3jwWLlyoeZsOh4OEhATcbneP9JNqX/7617+mpaVF4xBDoRC33norZWVl5ObmarydwWCgvr6eCxcuUFlZSWpq+ADA9vZ2rT4zZ87E7/drIbOu4bfvg5qBfEVXq40UCARobm7mkUceQa/X8/7773P+/HlycnK68Ve9jQZV+AKBAG63mwULFmCxWPjoo4+oqqoiKyurE/GpNpQsyyQnXzoXbdOmTXz22WeMGTOG4cOHM2vWLJqbm8nLy6OhoYFly5ZRWVnJM888Q3x8PKmpqTz55JPa/U1NTbz++usUFRVx6tQprFYrQ4YM0YLvAPHx8dTV1fGLX/yCl156iTlz5iCKIsXFxdos3dTUxMsvv8w111yD0+lkzpw5GAwGUlJSWLhwIQDTpk1DEAQSExO70RLqTJOamkpDQwOPPvoo77zzDoIg8MYbb2htNmnSJC3zRBUyt9vdKZkhso0rKyvZtWuXlrNnMBjYsGEDUVFR/P3vf6e0tFQj7NV7JEnSVGlxcTFPP/00VquVkydP8tZbb/Huu+9qayx+DI8niKI4Oy0t7XWVuO0JkZkNqgFdXl5OVFQUM2bMuLSu4GJGRddZrmuDqK+Wlhaqq6vZtm0bzc3NPProo7hcLvLz87vxTyaTifLycm666SZ27dqlecONjY3861//YsWKFVRXV5OamkpiYiKiKFJbW8v58+cxGAzcfPPN5OTkYLVaaWxs1GxJWZaxWCxajpyqclSovNmpU6fwer3079+fsWPHkpKSgsvl4tSpU+zbtw9JkoiKiiIUCpGQkMDbb7/N8OHDAXj22WdZunQpaWlpJCQk9KiiVA+/vr6ec+fO8dBDD1FTU8M777xDbGwskiR1W4xzRR0sCMTFxZGUlERlZaVmNuj1ehITE7VIiKpZ1O88Ho+mjVSIoqhlxkT2c2993Rv0er1NEEVxTlpa2obLCV6ksDQ2NlJfX8/NN99MaWkpiqKQlZWFzWbr5oR8X1k+n69TUqjJZNIWq0Q+sPrQLpeLqqoqBgwYwIABA6ivr9eiJBaLhdTUVGw2m0bXGAwGgsEgTqcTl8ulmQHqMkuHw0FUVBQ2m63HgHfkb6ud4XQ6aWlpIRQKaVk40dHRmlPV3t7OyZMntWC6KIp8++23xMbGajN512dToXrIVVVVOJ1OLV8uISGhk+CpS0q7rmfu6mHq9XqsVqumfWRZxuv1IssyUVFR3dbXdmUuZFnWVKwa91Xprch7rjpOe1Hw5qalpf3zSgRPrWhtbS2BQIDo6GiNYOxq111O8ODSLNra2orX69UyZCMbL7JB1U5paWkJZ/2GQhgMBqxWKw6HoxNPqJah0+k0pl7tpEjBj+QVu6IrV6WWpXa4Wi/1/kibTVEUmpqatIiCymX2phF68vb9fn8no7/rM6m2YU/lRP7taTD19Ls9oavd1rWsH0weX63gRVa2p0pdqc7vqUGu9N6ujR7ZMb01ZNcsisjnuNw9XYVf/Vx9dX2OnoSjax17e8be6hFpbqj/X40h37Xsnp6n6+ddB93l8EPsO9W5uKrCexLAnv5eSZmCIHTKdOgtDNPVEAd6XEDek90UWd+us1LX3+ta/546oydB6PpcihKO2fbUFr3NEpfr7Mgd+a+2oyMHSW/39tZmXZ9fff9D6tEVV7x9ulqhrscS9NZpV1IW0K28yGu6Xn+5zulJYFT0ZgRfqXHck5BcbR2upJ16er4f28GXq88PufbfVZ+rJpCh51F+tfghI/eHXHMlQvJj6vB9tuzV/ua/q2P/p0MPXPV20/+djfO/pWP+t9TzvwNNTU2yTpIknyzLP2Kv8z704aoQrKys9OkAP9B+pV5MH/rwI+GGcHaKV5blut5IzT704d+MUxAWvBZZls9d6f52fejDj8QRCAue0+/3H43c16wPffhPQRCEPRAWvAav1/t1IBDom/L68J9GSBCEDyEseD6fz3cyFAp9G7llQx/68B/AB+Xl5Y1waWljZXt7+wdqKnMf+vCfgCAIf1Pfq4J3zu12fxYIBCr7bL0+/CcgCEJZRUXF++r/kUcNBADFaDSONZlMfbR7H/6dUARBmFNXV1epfhApeB6/3y9YLJYMnU6X+W87OLkP/+chCMKrFRUVqyM/63q4SmN7e3urxWK5QRTFKHUBbx/68CNwRK/X//zChQudPNeukhVUFKU5FAo1GAyGMXq93tInfH34EWgQBGFSeXl5txOhe5Kq1mAw6A6FQvUGg2G0Tqcz9wlfH34ALsiyPPGbb77pvrkhvZ9j5w187gAAAUVJREFU5g4Gg43BYPCMXq8fDkT12Xx9uAocURRlwrffftvrgb2Xm8rcwWDwgtfrPWoymeIkScoURVHoLWO4D30g7L2+qtfrf15RUdF4uQu/T4e2KopS1draehw4A2TKshyrLn/rQx9UCIJQpijKL77++usXuzoSPV5/FWWnArnx8fG3WCyWqXq9foTBYBDVpYORq6r68H8GIeADQRD+dpEcvuKkzquVFAFIAVItFssgh8NRZDQah4mimKHT6ZKBaF0vuvj71itc6QKTnt73dm9P3/cNjh8MCXAC3wGHBUHYIwjCh2rs9WrxY3rBCMQBMYANsAB6URStoigauHhYG10OcIt4yRHXqFmocsTnMiAbDAYZkNXrBEGQ1e/U9+pLp9OpfyWdTieLoiirf00mk6TT6frSrH8A7Ha7b9++fR3ff+WV4/8D6NvfdcenpQcAAAAASUVORK5CYII=";
var PersistanceStrategy = /* @__PURE__ */ ((PersistanceStrategy2) => {
  PersistanceStrategy2[PersistanceStrategy2["LocalStorage"] = 0] = "LocalStorage";
  PersistanceStrategy2[PersistanceStrategy2["RestAPI"] = 1] = "RestAPI";
  return PersistanceStrategy2;
})(PersistanceStrategy || {});
const AppVariables = {
  versionNumber: "LEGACY-0.0.0",
  releaseDate: "November 31 2023",
  styleVariant: "dark",
  isMobile: false,
  persistMethod: PersistanceStrategy.LocalStorage,
  dbBackend: "SQLite",
  dbVersion: "1.0.0",
  server: "NOSERVER",
  serverVersion: "1.0.0",
  frontend: "React",
  frontendVersion: "17.0.2",
  frontendSource: "http://github.com",
  wizardDataUri: ""
};
const DefaultColors = {
  // nonsaturated
  lum0: "#000000",
  lum1: "#808080",
  lum2: "#999999",
  lum3: "#DDDDDD",
  lum4: "#EEEEEE",
  lum5: "#F8F8F8",
  lum6: "#FFFFFF",
  //   right/wrong
  right: "#006400",
  wrong: "#C00000",
  //   value colors
  str0: "#ADDFFF",
  str1: "#F5B8A9",
  str2: "#F5CCA9",
  str3: "#F5E1A9",
  str4: "#F5F3A9",
  str5: "#A9F5A9",
  //   offwhites
  off0: "#FFFFD0",
  off1: "#FFFFE0",
  off2: "#FFFACD",
  // highlight
  highlightColor0: "#0000FF",
  highlightColor1: "#FF0000",
  //   etc
  test7: "#006699",
  test8: "#0099CC",
  test9: "#BBFFBB",
  test10: "#CCFFCC",
  test11: "#DDFFDD"
};
const DarkColors = {
  // nonsaturated
  lum0: "#FFFFFF",
  lum1: "#F8F8F8",
  lum2: "#EEEEEE",
  lum4: "#999999",
  lum5: "#808080",
  lum3: "#555555",
  lum6: "#000000",
  //   value colors
  str0: "#004ED2",
  str1: "#B200DB",
  str2: "#D31700",
  str3: "#FF7900",
  str4: "#6BC837",
  str5: "#117433",
  //   right/wrong
  right: "#006400",
  wrong: "#C00000",
  //   offwhites
  off0: "#FFFFD0",
  off1: "#FFFFE0",
  // wizard color
  off2: "#4400AA",
  // highlight
  highlightColor0: "#0000FF",
  highlightColor1: "#FF0000",
  //   etc
  test7: "#006699",
  test8: "#0099CC",
  test9: "#BBFFBB",
  test10: "#CCFFCC",
  test11: "#DDFFDD"
};
const VariantMap = {
  dark: DarkColors,
  light: DefaultColors
};
const createColors = (variant) => {
  const Colors = VariantMap[variant];
  return {
    input: {
      backgroundColor: `${Colors.lum6}`,
      color: `${Colors.lum0}`
    },
    select: {
      backgroundColor: `${Colors.lum6}`,
      color: `${Colors.lum0}`
    },
    textArea: {
      backgroundColor: `${Colors.lum6}`,
      color: `${Colors.lum0}`
    },
    body: {
      backgroundColor: Colors.lum6,
      color: Colors.lum0,
      font: '100%/1.25 "Lucida Grande",Arial,sans-serif,STHeiti,"Arial Unicode MS",MingLiu',
      margin: "20px",
      padding: "0px"
    },
    "input[type=text]": {
      font: '85% "Lucida Grande",Arial,sans-serif,STHeiti,"Arial Unicode MS",MingLiu',
      border: `1px solid ${Colors.lum0}`,
      padding: "3px"
    },
    p: {
      margin: "5px 0 5px 0",
      padding: 0
    },
    h3: {
      margin: "0px 0 0px 0",
      padding: "0"
    },
    h4: {
      margin: "5px 0 10px 0",
      padding: "0"
    },
    "span.status0": {
      backgroundColor: Colors.str0,
      color: Colors.lum0
    },
    "span.status1": {
      backgroundColor: Colors.str1,
      color: Colors.lum0
    },
    "span.status2": {
      backgroundColor: Colors.str2,
      color: Colors.lum0
    },
    "span.status3": {
      backgroundColor: Colors.str3,
      color: Colors.lum0
    },
    "span.status4": {
      backgroundColor: Colors.str4,
      color: Colors.lum0
    },
    "span.status5": {
      backgroundColor: Colors.test11,
      color: Colors.lum0
    },
    "span.status99": {
      backgroundColor: Colors.lum5,
      borderBottom: `solid 2px ${Colors.test10}`,
      color: Colors.lum0
    },
    "span.status98": {
      backgroundColor: Colors.lum5,
      borderBottom: `dashed 1px ${Colors.test10}`,
      color: Colors.lum0
    },
    "span.mwsty": {
      marginRight: "2px",
      fontSize: "60%",
      fontWeight: "bold",
      color: Colors.lum0,
      verticalAlign: "top,"
    },
    "span.wsty": {
      marginRight: "2px",
      color: Colors.lum0
    },
    "span.todosty": {
      backgroundColor: Colors.str3
    },
    "span.doneoksty": {
      backgroundColor: Colors.str5
    },
    "span.donewrongsty": {
      backgroundColor: Colors.str1
    },
    "span.status5stat": {
      backgroundColor: Colors.test9,
      color: Colors.lum0
    },
    textarea: {
      font: '85% "Lucida Grande",Arial,sans-serif,STHeiti,"Arial Unicode MS",MingLiu',
      border: `1px solid ${Colors.lum0}`,
      padding: "3px"
    },
    "table.tab1": {
      backgroundColor: Colors.lum5,
      marginBottom: "10px",
      marginTop: "10px",
      borderTop: `1px solid ${Colors.lum0}`,
      borderLeft: `1px solid ${Colors.lum0}`,
      width: "850px"
    },
    "table.tab2": {
      backgroundColor: Colors.lum5,
      marginBottom: "10px",
      marginTop: "10px",
      borderTop: `1px solid ${Colors.lum0}`,
      borderLeft: `1px solid ${Colors.lum0}`,
      width: "100%"
    },
    "table.tab3": {
      backgroundColor: Colors.lum5,
      marginBottom: "10px",
      marginTop: "10px",
      borderTop: `1px solid ${Colors.lum0}`,
      borderLeft: `1px solid ${Colors.lum0}`,
      width: "auto"
    },
    "td.td1": {
      borderBottom: `1px solid ${Colors.lum0}`,
      borderRight: `1px solid ${Colors.lum0}`,
      verticalAlign: "top,"
    },
    "td.td1bot": {
      borderBottom: `1px solid ${Colors.lum0}`,
      borderRight: `1px solid ${Colors.lum0}`,
      verticalAlign: "bottom,"
    },
    "th.th1": {
      borderBottom: `1px solid ${Colors.lum0}`,
      borderRight: `1px solid ${Colors.lum0}`,
      backgroundColor: Colors.lum3,
      verticalAlign: "top,"
    },
    "th.clickable": {
      cursor: "pointer"
    },
    ".click": {
      cursor: "pointer",
      color: Colors.wrong
    },
    ".clickedit": {
      cursor: "pointer"
    },
    ".hide": {
      display: "none"
    },
    a: {
      textDecoration: "none"
    },
    "a:link": {
      color: Colors.wrong
    },
    "a:visited": {
      color: Colors.wrong
    },
    "a:active": {
      color: Colors.wrong
    },
    "a:focus": {
      color: Colors.wrong
    },
    "a:hover": {
      color: Colors.wrong
    },
    ".a": {
      textDecoration: "none",
      cursor: "pointer",
      color: Colors.wrong
    },
    ".a:focus": {
      color: Colors.str3
    },
    ".a:hover": {
      color: Colors.str3
    },
    img: {
      border: "0pt none"
    },
    ".red": {
      color: Colors.highlightColor1,
      fontWeight: "bold",
      backgroundColor: Colors.off0,
      textAlign: "center",
      fontSize: "120%"
    },
    ".msgblue": {
      color: Colors.highlightColor0,
      fontWeight: "bold",
      padding: "3px",
      backgroundColor: Colors.off1,
      textAlign: "center",
      fontSize: "120%"
    },
    ".red2": {
      color: Colors.highlightColor1,
      fontWeight: "bold"
    },
    ".red3": {
      color: Colors.highlightColor1
    },
    ".scorered": {
      fontWeight: "bold",
      color: Colors.highlightColor1
    },
    ".scoregreen": {
      color: Colors.right
    },
    ".left": {
      textAlign: "left"
    },
    ".right": {
      textAlign: "right"
    },
    ".center": {
      textAlign: "center"
    },
    ".bigger": {
      fontSize: "130%"
    },
    ".smaller": {
      fontSize: "80%"
    },
    ".backgray": {
      backgroundColor: Colors.lum3
    },
    ".backlightyellow": {
      backgroundColor: Colors.off2
    },
    ".small": {
      color: Colors.lum0,
      fontSize: "60%"
    },
    ".smallgray": {
      color: `${Colors.lum1}`,
      fontSize: "60%"
    },
    ".smallgray2": {
      color: `${Colors.lum1}`,
      fontSize: "80%"
    },
    ".smallgray3": {
      color: `${Colors.lum1}`,
      fontSize: "70%",
      width: "850px",
      marginBottom: "20px"
    },
    "#learnstatus": {
      color: Colors.lum0,
      fontSize: "120%",
      fontWeight: "bold"
    },
    "#iknowall": {
      backgroundColor: Colors.str0,
      cursor: "pointer",
      color: Colors.wrong,
      padding: "5px",
      border: `1px solid ${Colors.lum0}`,
      textAlign: "center"
    },
    "img.lwtlogo": {
      marginRight: "15px",
      float: "left"
    },
    "img.lwtlogoright": {
      marginLeft: "30px",
      float: "right"
    },
    ".inline": {
      display: "inline"
    },
    ".grayborder": {
      border: "1pt solid #808080"
    },
    ".graydotted": {
      marginTop: "30px",
      paddingTop: "5px",
      borderTop: `1px dotted ${Colors.lum0}`
    },
    "#printoptions": {
      marginBottom: "15px",
      paddingBottom: "15px",
      borderBottom: `1px dotted ${Colors.lum0}`,
      lineHeight: 1.8,
      marginTop: "20px"
    },
    ".width50px": {
      width: "50px"
    },
    ".width99pc": {
      width: "99%"
    },
    ".width45pc": {
      width: "45%"
    },
    dd: {
      marginTop: "10pt"
    },
    dt: {
      marginTop: "10pt"
    },
    ".annterm": {
      fontWeight: "bold",
      borderBottom: `2px solid ${Colors.lum0}`
    },
    ".anntermruby": {
      fontWeight: "normal",
      borderBottom: `2px solid ${Colors.lum0}`
    },
    ".annrom": {
      color: Colors.lum2,
      fontSize: "60%",
      fontStyle: "italic"
    },
    ".annromruby": {
      color: Colors.lum0,
      fontSize: "100%",
      fontStyle: "italic"
    },
    ".annromrubysolo": {
      color: Colors.lum0,
      fontSize: "100%",
      fontStyle: "normal"
    },
    ".anntrans": {
      color: Colors.test8,
      fontSize: "60%",
      fontStyle: "normal"
    },
    ".anntransruby": {
      color: Colors.test8,
      fontSize: "100%",
      fontStyle: "normal"
    },
    ".anntransruby2": {
      color: Colors.test7,
      fontSize: "125%",
      fontStyle: "normal"
    },
    "#footer": {
      bottom: 0,
      position: "absolute",
      width: "100%",
      height: "45px",
      lineHeight: "30px",
      background: Colors.lum3,
      fontSize: "14px",
      textAlign: "center",
      borderTop: `1px solid ${Colors.lum0}`
    },
    ".borderl": {
      borderLeft: `1px solid ${Colors.lum0}`,
      borderTop: `1px solid ${Colors.lum0}`,
      borderBottom: `1px solid ${Colors.lum0}`
    },
    ".borderr": {
      borderTop: `1px solid ${Colors.lum0}`,
      borderBottom: `1px solid ${Colors.lum0}`,
      borderRight: `1px solid ${Colors.lum0}`
    },
    ".uwordmarked": {
      fontWeight: "bold",
      borderTop: `3px solid ${Colors.highlightColor1}`,
      borderBottom: `3px solid ${Colors.highlightColor1}`,
      borderRight: `3px solid ${Colors.highlightColor1}`,
      borderLeft: `3px solid ${Colors.highlightColor1}`
    },
    ".kwordmarked": {
      fontWeight: "bold",
      borderTop: `3px solid ${Colors.lum6}`,
      borderBottom: `3px solid ${Colors.lum6}`,
      borderLeft: `3px solid ${Colors.lum6}`,
      borderRight: `3px solid ${Colors.lum6}`
    },
    "#termtags": {
      width: "340px",
      marginTop: "0px",
      marginBottom: "0px",
      marginLeft: "2px"
    },
    "#texttags": {
      width: "340px",
      marginTop: "0px",
      marginBottom: "0px",
      marginLeft: "2px"
    },
    ".editable_textarea": {
      display: "inline"
    },
    ".nowrap": {
      whiteSpace: "nowrap",
      marginLeft: "20pt"
    },
    ".borderleft": {
      borderLeft: `1px solid ${Colors.lum6}`,
      borderTop: `1px solid ${Colors.lum6}`,
      borderBottom: `1px solid ${Colors.lum6}`,
      backgroundColor: Colors.lum4
    },
    ".bordermiddle": {
      borderTop: `1px solid ${Colors.lum6}`,
      borderBottom: `1px solid ${Colors.lum6}`,
      backgroundColor: Colors.lum4
    },
    ".borderright": {
      borderRight: `1px solid ${Colors.lum6}`,
      borderTop: `1px solid ${Colors.lum6}`,
      borderBottom: `1px solid ${Colors.lum6}`,
      backgroundColor: Colors.lum4
    },
    ".wizard": {
      margin: "20px 0 5px 0"
    },
    /**************************************************************
    Additional styles for printing
    ***************************************************************/
    "@media print": {
      ".noprint": {
        display: "none"
      },
      "#print": {
        fontSize: "75%"
      }
    },
    /*************************************************************
    Split View
    ***************************************************************/
    ".Resizer": {
      position: "relative",
      background: "darkGray",
      "-moz-box-sizing": "border-box",
      "-webkit-box-sizing": "border-box",
      "box-sizing": "border-box",
      "-moz-background-clip": "padding",
      "-webkit-background-clip": "padding",
      "background-clip": "padding-box"
    },
    /*
     .Resizer:hover,
     .Resizer:active {
    -webkit-transition: all 2s ease,
    transition: all 2s ease,
     }*/
    ".Resizer.horizontal": {
      height: "20px",
      margin: "-5px 0",
      "border-top": "5px solid rgba(255, 255, 255, 0)",
      "border-bottom": "5px solid rgba(255, 255, 255, 0)",
      cursor: "row-resize",
      width: "100%"
    },
    /*   
     .Resizer.horizontal:hover,
     .Resizer.Resizer.horizontal:active {
    border-top: 5px solid rgba(0, 0, 0, 0.5),
    border-bottom: 5px solid rgba(0, 0, 0, 0.5),
     }
      */
    ".Resizer.vertical": {
      width: "20px",
      margin: "0 -5px",
      "border-left": "5px solid rgba(255, 255, 255, 0)",
      "border-right": "5px solid rgba(255, 255, 255, 0)",
      cursor: "col-resize"
    },
    /*
     .Resizer.vertical:hover,
     .Resizer.vertical:active {
    border-left: 5px solid rgba(0, 0, 0, 0.5),
    border-right: 5px solid rgba(0, 0, 0, 0.5),
     }
     */
    ".Resizer.disabled": {
      cursor: "notAllowed"
    },
    // '.Resizer.disabled':hover,
    ".Resizer.disabled:active": {
      borderColor: "transparent"
    },
    // '.Resizer::after',
    ".Resizer::before": {
      content: "",
      "border-left": "1px solid #333",
      position: "absolute",
      top: "50%",
      transform: "translateY(-100%)",
      right: 0,
      display: "inline-block",
      height: "20px",
      margin: "0 2px"
    },
    " .Resizer::before": {
      left: 0
    }
  };
};
let mainWindow;
function createWindow() {
  mainWindow = new electron.BrowserWindow({
    // transparent: true,
    backgroundMaterial: "acrylic"
    // frame: false,
    // backgroundColor: '#FF0000',
  });
  mainWindow.setIcon(electron.nativeImage.createFromDataURL(icon));
  const style = createColors(AppVariables.styleVariant);
  console.log(style["body"].backgroundColor);
  mainWindow.blur();
  mainWindow.loadURL("http://localhost:5173");
  mainWindow.on("closed", () => mainWindow = null);
  const template = [
    {
      label: "New",
      submenu: [
        {
          label: "Language",
          click: (_, window2) => {
            window2?.loadURL("http://localhost:5173/edit_languages?new=1");
          }
        },
        {
          label: "Text",
          submenu: [
            {
              label: "Short Text",
              click: (_, window2) => {
                window2?.loadURL("http://localhost:5173/edit_texts?new=1");
              }
            },
            {
              label: "Long Text",
              click: (_, window2) => {
                window2?.loadURL("http://localhost:5173/long_text_import");
              }
            }
          ]
        },
        {
          label: "Word Tag",
          click: (_, window2) => {
            window2?.loadURL("http://localhost:5173/edit_tags?new=1");
          }
        },
        {
          label: "Text Tag",
          click: (_, window2) => {
            window2?.loadURL("http://localhost:5173/edit_texttags?new=1");
          }
        }
      ]
    },
    {
      label: "Edit",
      submenu: [
        // {
        //   role: 'undo',
        // },
        // {
        //   role: 'redo',
        // },
        // {
        //   type: 'separator',
        // },
        {
          role: "cut"
        },
        {
          role: "copy"
        },
        {
          role: "paste"
        }
      ]
    },
    {
      label: "View",
      submenu: [
        {
          role: "reload"
        },
        {
          role: "toggleDevTools"
        },
        {
          type: "separator"
        },
        {
          role: "resetZoom"
        },
        {
          role: "zoomIn"
        },
        {
          role: "zoomOut"
        },
        {
          type: "separator"
        },
        {
          role: "togglefullscreen"
        }
      ]
    },
    {
      role: "window",
      submenu: [
        {
          role: "minimize"
        },
        {
          role: "close"
        }
      ]
    },
    {
      role: "help",
      submenu: [
        {
          label: "Learn More"
        }
      ]
    }
  ];
  const menu = electron.Menu.buildFromTemplate(template);
  electron.Menu.setApplicationMenu(menu);
}
electron.app.whenReady().then(() => {
  createWindow();
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.app.on("activate", () => {
  if (mainWindow == null) {
    createWindow();
  }
});
